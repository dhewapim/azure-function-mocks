const mTLS = require("./mTLS");

const processor = require("@nwisbeta/dhew-mocks").mpi.pdq.InvokePatientDemographicsQuery;

async function run (context, req) {

  context.log(req.method, req.url);
  try {
    const clientCert = mTLS.getClientCertificate(req);
    mTLS.checkClientCertificate(clientCert);
  }
  catch(error) {
    if (error.missingCertificate) {
      context.res = {
        status: 496,
        body: "SSL Certificate Required"
      };
    } else {
      context.res = {
        status: 495,
        body: "SSL Certificate Error: \n" + error.pem
      };    
    }

    return;
  }
  
  let outputResponse = processor(req.body);
 
  context.res.type("application/xml")
  context.res = {
      // status: 200, /* Defaults to 200 */
      body: outputResponse
  };
}

exports.run = run;
