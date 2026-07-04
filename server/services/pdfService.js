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
  return new Promise((resolve, reject) => {
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
      doc.fontSize(20).font('Helvetica-Bold').text('RoadLink', { align: 'left' });
      doc.fontSize(12).font('Helvetica').text('Order Receipt', { align: 'left' });
      doc.moveDown(2);

      // Order Info
      doc.fontSize(12).font('Courier-Bold').text(`Order ID: ${order._id}`);
      doc.font('Helvetica').text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`);
      
      const vehicleName = order.vehicleId ? (order.vehicleId.displayName || order.vehicleId.registrationNumber) : 'Unknown Vehicle';
      doc.text(`Vehicle: ${vehicleName}`);
      doc.moveDown(1);

      // Line Items
      doc.font('Helvetica-Bold').text('Line Items:');
      doc.font('Helvetica').text(`- Tier: ${order.tier.charAt(0).toUpperCase() + order.tier.slice(1)}`);
      
      if (order.tier === 'premium') {
        doc.text(`- Design: Custom Design`);
      } else if (order.templateSelections && order.templateSelections.length > 0) {
        order.templateSelections.forEach(selection => {
           const tmplName = selection.templateId ? selection.templateId.name : 'Template';
           doc.text(`- Design: ${tmplName} ${selection.position ? `(${selection.position})` : ''}`);
        });
      }
      
      const qty = order.tier === 'reflective' ? 2 : 1;
      doc.text(`- Quantity: ${qty}`);
      doc.moveDown(1);

      // Price Breakdown
      doc.font('Helvetica-Bold').text('Price Breakdown:');
      doc.font('Courier').text(`Subtotal: \u20B9${order.pricing.basePrice}`);
      doc.text(`Shipping: \u20B9${order.pricing.shippingFee}`);
      doc.text(`GST:      \u20B9${order.pricing.gst}`);
      doc.moveDown(0.5);
      doc.fontSize(14).font('Courier-Bold').text(`Total:    \u20B9${order.pricing.total}`);
      doc.moveDown(1);

      // Payment Details
      doc.fontSize(12).font('Helvetica-Bold').text('Payment Method:');
      doc.font('Helvetica').text(`Razorpay Ref: ${order.razorpayOrderId || 'N/A'}`);
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
      doc.fontSize(10).font('Helvetica-Oblique').text('Support: support@roadlink.com', { align: 'center' });
      doc.text('This is a computer-generated receipt.', { align: 'center' });

      doc.end();

      writeStream.on('finish', () => {
        // Return a path that the client can access via the backend server
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
