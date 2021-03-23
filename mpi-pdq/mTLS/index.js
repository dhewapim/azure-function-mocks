const { pki, md, asn1 } = require('node-forge');

function getClientCertificate(req){
    // Get header
    const header = req.headers['x-arr-clientcert'];
    if (!header) throw { missingCertificate: true };

    // Convert from PEM to pki.CERT
    return `-----BEGIN CERTIFICATE-----${header}-----END CERTIFICATE-----`;
}

function checkClientCertificate(pem){

    const incomingCert = pki.certificateFromPem(pem);

    // Validate certificate thumbprint
    const fingerPrint = md.sha1.create().update(asn1.toDer(pki.certificateToAsn1(incomingCert)).getBytes()).digest().toHex();

    if (fingerPrint.toLowerCase() !== 'b4e8545f5b59d5507a05d3399c6e7b66cf0c8c09') throw { pem };

    // Validate time validity
    const currentDate = new Date();
    if (currentDate < incomingCert.validity.notBefore || currentDate > incomingCert.validity.notAfter) throw { pem };

    // Validate issuer
    if (incomingCert.issuer.hash.toLowerCase() !== 'd6f4c6090d14c126a4b9a04764d3a19c3c01502b') throw { pem };

    // Validate subject
    if (incomingCert.subject.hash.toLowerCase() !== 'd23fddc78f237a30e30634080d4b4f4694b00537') throw { pem };
}

exports.getClientCertificate = getClientCertificate;
exports.checkClientCertificate = checkClientCertificate;