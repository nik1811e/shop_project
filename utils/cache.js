module.exports = (cacheService) => {
    return (req, res, next) => {
        const data = cacheService.get(req);

        if (data)
            res.json(data);
        else
            next();
    }
};
/**
 * Created by Nikita on 13.04.2017.
 */
