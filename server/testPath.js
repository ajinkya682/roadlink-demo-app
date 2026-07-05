try {
  require('./services/cloudinary');
  console.log('2 levels works from modules/vehicles');
} catch (e) {
  console.log(e);
}
