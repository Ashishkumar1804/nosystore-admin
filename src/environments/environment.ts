export const environment = {
  production: true,
  googleKey: 'AIzaSyBUKpzHeU7PPR5y_AizLYYVZ20YnSyWx58',
  // apiUrl: "http://localhost:3000/api",

  // apiUrl: "http://13.203.3.128:3000/api",
  //stagingUrl
  // apiUrl:"http://35.154.243.49:3000/api",
  baseUrl:"https://nosystore-bucket.s3.ap-south-1.amazonaws.com/",
  imageUrl: "https://devserverspace.blr1.digitaloceanspaces.com/",
  // imagePath: 'https://creditreward-bcket.s3.amazonaws.com/',
   get apiUrl() {
    const hostname = window.location.hostname;
    // Define your conditions to determine the API URL
    if (hostname === 'api-staging.nosystore.com') {
      return 'https://api-staging.nosystore.com/api';
    }
     else if (hostname === 'admin.nosystore.com') {
      return 'https://api.nosystore.com/api';
    }
     else { 
      return 'https://api.nosystore.com/api'; 
      return 'http://localhost:3000/api';

    }
  },

};