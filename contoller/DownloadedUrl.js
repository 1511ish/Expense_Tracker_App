const sequelize = require('../util/database');
const DownloadedUrl = require('../models/DownloadedUrl');

exports.getDownlodedFileUrls = async (req,res) => {
    const userId = req.userId;
    //i dont know why nicje wali line kaam ni krri hai..
    // const downlodedFileUrls = await user.getDownloadedFiles();
    const downlodedFileUrls = await DownloadedUrl.findAll({where:{userId: userId}});
    res.status(200).json({ fileURL: downlodedFileUrls, success: true});
}