'use strict'
const db = require('../database');
exports.find = (query = {}) => {
    return db.Songs.findAll({
        where: query
    });
};
exports.create = (song) => {
    const model = db.Songs.build(song);
    return model.validate()
        .then(err => {
            if (err) {
                return Promise.reject(err);
            }
            return model.save();
        });
};

exports.findById = (id) => {
    return db.Songs.findById(id);
};
exports.findByArtist= (artist) => {
    return db.Songs.findAll({
  where: {
    artist: artist,
  }
});};

exports.update = (song,id) => {
  return  db.Songs.update(
    {
        title: song.title,
        album: song.album,
        artist: song.artist,
        year: song.year,
        bpm: song.bpm
    },
    { where:{
      id: id

    }
  });
};


exports.destroy=(id)=>{
  return db.Songs.destroy({
  where : {
      id: id
    }
  });
}
