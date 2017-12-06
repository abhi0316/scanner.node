const sqlite3 = require('sqlite3').verbose()

var db = new sqlite3.Database ('/home/nest/NEST/nest_python/Db/config.db',sqlite3.OPEN_READWRITE,(err) =>{
                  if (err) {
			console.error(err.message)
			}
		console.log('connected');
  });

db.serialize(() => {
	db.each('select * from config ',(err,row) => {
	if (err) {
	 console.error(err.message);
		}
		console.log(row.name);
	});
});

