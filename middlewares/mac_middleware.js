// const authenticate = async (req, res, next) => {
//     try {
//         const clientMAC = req.headers['mac-address']; // Assuming MAC address is passed in headers
//         if (!clientMAC) {
//             return res.status(401).json({ message: 'MAC address not provided' });
//         }
//         if (macAddresses.has(clientMAC)) {
//             next();
//         } else {
//             return res.status(401).json({ message: 'Unauthorized MAC address' });
//         }
//     } catch (error) {
//         console.error('Error authenticating:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };


// module.exports = authenticate

const extractMACAddress = (req, res, next) => {
    const macAddress = req.headers;
    console.log(macAddress, "macAddressmacAddressmacAddress")
    if (!macAddress) {
        return res.status(400).json({ message: 'MAC address not provided' });
    }
    else {
        req.macAddress = macAddress;
        next();
    }
};

module.exports = {
    extractMACAddress
}