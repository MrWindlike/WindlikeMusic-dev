let axios = require('axios')

module.exports = function getHotlist(app) {
  /* Constanse */
  const URL = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';

  app.get('/getHotlist', (req, res)=> {
    axios.get(URL, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    }).then((data)=> {
    	res.json(data.data);
    }).catch((e)=> {
    	console.log(e);
    });
  });
}