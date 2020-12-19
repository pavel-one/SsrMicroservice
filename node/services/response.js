module.exports = function (req, res, next) {
    res.success = (text = '', data = [], code = 200) => {
        res.statusCode = code;
        return res.send({
            success: true,
            msg: text,
            data: data
        })
    }

    res.fail = (text = '', data = [], code = 200) => {
        res.statusCode = code;
        return res.send({
            success: false,
            msg: text,
            data: data
        })
    }

    next();
}