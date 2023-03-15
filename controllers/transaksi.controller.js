const app = require("../routes/transaksi.route")
const moment = require("moment")
/** load model for `transaksi` table */
const transaksiModel = require(`../models/index`).transaksi
const menuModel = require(`../models/index`).menu
/** load model for `details_transaksi` table */
const detailTransaksiModel = require(`../models/index`).detail_transaksi
/** load Operator from Sequelize */
const Op = require(`sequelize`).Op

/** create function for add transaksi */
exports.addTransaksi = async (request, response) => {
    let harga
    let qty
    /** prepare data for transaksi table */
    let newData = {
        tgl_transaksi: moment().format("YYYY-MM-DD"),
        id_user: request.body.id_user,
        id_meja: request.body.id_meja,
        nama_pelanggan: request.body.nama_pelanggan,
        status: request.body.status,

    }

    let DetailTransaksi = request.body.detail_transaksi
    let menu = await menuModel.findAll()

    /** execute for inserting to transaksi's table */

    await transaksiModel.create(newData)
        .then(result => {

            let idTransaksi = result.id_transaksi
            for(j=0; j<DetailTransaksi.length;j++){
                DetailTransaksi[j].id_transaksi = idTransaksi

                for(i=0; i<DetailTransaksi.length;i++)
            {
                let id_menu = DetailTransaksi[i].id_menu
                if(menu[i].id_menu == id_menu){
                    harga = menu[i].harga
                    qty = DetailTransaksi[i].qty
                }
            } 
            }

            /** insert all data of detailTransaksi */
            detailTransaksiModel.bulkCreate(DetailTransaksi)
                .then(result => {
                    return response.json({
                        success: true,
                        message: `New Transaction has been inserted`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for update transaksi */
exports.updateTransaksi = async (request, response) => {
    /** prepare data for transaksi's table */
    let newData = {
        tgl_transaksi: moment().format("YYYY-MM-DD"),
        id_user: request.body.id_user,
        id_meja: request.body.id_meja,
        nama_pelanggan: request.body.nama_pelanggan,
        status: request.body.status
    }
    /** prepare parameter transaksi ID */
    let idTransaksi = request.params.id
    /** execute for inserting to transaksi's table */
    transaksiModel.update(newData, { where: { id_transaksi: idTransaksi } })
        .then(async result => {
            /** delete all detailTransaksi based on idTransaksi */
            await detailTransaksiModel.destroy(
                { where: { id_transaksi: idTransaksi } }
            )
            /** store details of transaksi from request
            * (type: array object)
            */
            let detailTransaksi = request.body.detail_transaksi
            /** insert idTransaksi to each item of detailTransaksi
            */
            for (let i = 0; i < detailTransaksi.length; i++) {
                detailTransaksi[i].id_transaksi = idTransaksi
            }
            /** re-insert all data of detailTransaksi */
            detailTransaksiModel.bulkCreate(detailTransaksi)
                .then(result => {
                    return response.json({
                        success: true,
                        message: `Transaction has been
    updated`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for delete transaksi's data */
exports.deleteTransaksi = async (request, response) => {
    /** prepare idTransaksi that as paramter to delete */
    let idTransaksi = request.params.id
    /** delete detailTransaksi using model */
    detailTransaksiModel.destroy(
        { where: { id_transaksi: idTransaksi } }
    )
        .then(result => {
            /** delete transaksis data using model */
            transaksiModel.destroy({ where: { id_transaksi: idTransaksi } })
                .then(result => {
                    return response.json({
                        success: true,
                        message: `Transaksi's has deleted`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for get all transaksi data */
exports.getTransaksi = async (request, response) => {
    let data = await transaksiModel.findAll(
        {
            include: [
                `users`, `meja`,
                {
                    model: detailTransaksiModel,
                    as: `detail_transaksi`,
                    include: ["menu"]
                }
            ]
        }
    )
    return response.json({
        success: true,
        data: data,
        message: `All transaction book have been loaded`
    })
}

exports.filterTransaksi = async (request, response) => {
    let start = request.body.start;
    let end = request.body.end;

    let data = await transaksiModel.findAll({
        include: [
            "users",
            "meja",
            {
                model: detailTransaksiModel,
                as: "detail_transaksi",
                include:["menu"],
            },
        ],
        where:{
            tgl_transaksi:{
                [Op.between]:[start, end],
            },
        },
    });
    return response.json(data);
}