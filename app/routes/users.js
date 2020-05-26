var express = require('express');
var router = express.Router();
var mysql = require('mysql')

/* GET users listing. */
router.get('/test', function(req, res, next) {
  res.send('respond with a resource');
});

var pool = mysql.createPool({
  host:'39.98.131.44',
  user:'u1',
  password:'ZUCCdjl!',
  database:'JS'
})

var connMethod = function(callback){

}

let query = function( sql, values ) {
  // 返回一个 Promise
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          // 结束会话
          connection.release()
        })
      }
    })
  })
}

function formatIndex(data){
	console.log(data)
	var res = [];
	for (i in data){
		var t={};
		t.type = i;
		t.index = data[i];
		res.push(t);
	}
	console.log(res);
	return res;
}

var sql = 'select type_name,index_name from job_type t, job_index i where i.type_id = t.id'


router.get('/type_index',async(req,res)=>{
	let data = {};
	const rows = await query(sql);
	for(row of rows){
	  	if(!data[row.type_name]){
	  		data[row.type_name] = [];
	  	}
	  	data[row.type_name].push(row.index_name);
	}
	console.log(data);
	data = formatIndex(data);
	console.log(data);
	res.json(data);
})

module.exports = router;
