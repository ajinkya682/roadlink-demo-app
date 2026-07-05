const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate a PDF receipt and save it to the local uploads folder as a temporary stand-in.
 * Once Cloudinary/S3 credentials are provided, we can swap the storage adapter here.
 * @param {Object} order - The populated order object.
 * @returns {Promise<String>} - URL/path to the generated PDF.
 */
exports.generateReceiptPDF = (order) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const filename = `receipt_${order._id}.pdf`;
      const receiptsDir = path.join(__dirname, '..', 'uploads', 'receipts');
      const filepath = path.join(receiptsDir, filename);

      // Ensure directory exists
      if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir, { recursive: true });
      }

      const writeStream = fs.createWriteStream(filepath);
      doc.pipe(writeStream);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('RoadLink', { align: 'left' });
      doc.fontSize(12).font('Helvetica').fillColor('#666666').text('Official Order Receipt', { align: 'left' });
      doc.moveDown(2);
      
      doc.fillColor('#000000');

      // Order Info
      doc.fontSize(12).font('Courier-Bold').text(`Order ID: ${order._id}`);
      doc.font('Helvetica').text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`);
      
      const vehicleName = order.vehicleId ? (order.vehicleId.displayName || order.vehicleId.registrationNumber) : 'Unknown Vehicle';
      doc.text(`Vehicle: ${vehicleName}`);
      doc.moveDown(1.5);

      // Line Items
      doc.fontSize(14).font('Helvetica-Bold').text('Order Details:');
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica').text(`Tier: ${order.tier.charAt(0).toUpperCase() + order.tier.slice(1)}`);
      
      const qty = order.tier === 'reflective' ? 2 : 1;
      doc.text(`Quantity: ${qty}`);
      doc.moveDown(1);

      if (order.tier === 'premium') {
        doc.text(`- Design: Custom Design`);
      } else if (order.templateSelections && order.templateSelections.length > 0) {
        doc.font('Helvetica-Bold').text('Selected Templates:');
        doc.moveDown(0.5);
        
        for (const selection of order.templateSelections) {
          const tmplName = selection.templateId ? selection.templateId.name : 'Template';
          doc.font('Helvetica').text(`- ${tmplName} ${selection.position ? `(${selection.position})` : ''}`);
          
          // Embed image if available
          if (selection.previewImageUrl) {
            try {
              let imageBuffer;
              if (selection.previewImageUrl.startsWith('http')) {
                const response = await fetch(selection.previewImageUrl);
                const arrayBuffer = await response.arrayBuffer();
                imageBuffer = Buffer.from(arrayBuffer);
              } else {
                // Local file path from frontend
                const localPath = path.join(__dirname, '../../../client', selection.previewImageUrl);
                if (fs.existsSync(localPath)) {
                  imageBuffer = fs.readFileSync(localPath);
                }
              }
              
              if (imageBuffer) {
                // Draw image indented
                doc.image(imageBuffer, { width: 100 });
                doc.moveDown(0.5);
              }
            } catch (imgErr) {
              console.error('Failed to embed image in PDF:', imgErr);
            }
          }
        }
      }
      
      doc.moveDown(1);

      // Price Breakdown
      doc.fontSize(14).font('Helvetica-Bold').text('Payment Breakdown:');
      doc.moveDown(0.5);
      doc.fontSize(12).font('Courier').text(`Subtotal: \u20B9${order.pricing.basePrice}`);
      doc.text(`Shipping: \u20B9${order.pricing.shippingFee}`);
      doc.text(`GST:      \u20B9${order.pricing.gst}`);
      doc.moveDown(0.5);
      doc.fontSize(14).font('Courier-Bold').text(`Total:    \u20B9${order.pricing.total}`);
      doc.moveDown(1.5);
      
      doc.fillColor('#000000');

      // Payment Details
      doc.fontSize(12).font('Helvetica-Bold').text('Payment Method:');
      if (order.pricing.total === 0) {
        doc.font('Helvetica').text(`Status: Free Tier (No Payment Required)`);
      } else {
        doc.font('Helvetica').text(`Razorpay Ref: ${order.razorpayOrderId || 'N/A'}`);
      }
      doc.moveDown(1);

      // Shipping Address
      if (order.shippingAddress && order.shippingAddress.name) {
        doc.font('Helvetica-Bold').text('Shipping Address:');
        doc.font('Helvetica').text(order.shippingAddress.name);
        doc.text(order.shippingAddress.line1);
        if (order.shippingAddress.line2) doc.text(order.shippingAddress.line2);
        doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`);
        doc.text(`Phone: ${order.shippingAddress.phone}`);
      }
      
      doc.moveDown(2);
      
      // Footer
      doc.fontSize(10).font('Helvetica-Oblique').fillColor('#888888').text('Support: support@roadlink.com', { align: 'center' });
      doc.text('This is a computer-generated receipt.', { align: 'center' });

      doc.end();

      writeStream.on('finish', () => {
        const fileUrl = `/uploads/receipts/${filename}`;
        resolve(fileUrl);
      });
      
      writeStream.on('error', (err) => {
        reject(err);
      });
      
    } catch (error) {
      reject(error);
    }
  });
};
