const router = require('express').Router();
const SongService = require('../services/songs');
const _ = require("lodash");

// Validation des données du formulaires de création d'une chanson
var addSongMiddleware = function(req, res, next) {
   var title=req.body.title;
   var artist=req.body.artist;
   var album=req.body.album;
   var year=req.body.year;
   var bpm=req.body.bpm;
   if(typeof bpm === 'string' && typeof title === 'string' && typeof artist === 'string' && typeof album === 'string'  && typeof year === 'string'){
      next();
    }else{
             res.status(400).send();
    }
   };

router.post('/',addSongMiddleware, function(req, res,next) {
    // Verifier si les informations sont complètes
    /*const keys = _.keys(req.body);
    const mandatoryKeys = ['title', 'album', 'artist', 'year', 'bpm'];
    const difference = _.difference(mandatoryKeys, keys);
    if (!difference.length) {
        res.status(400).send({
            message: " Il manque le(s) champs " + difference
        });

    }*/

    return SongService.create(req.body)
        .then(song => {
          if (req.accepts('text/html')) {
              return res.render('song', {
                  song: song
              });
          }
          if (req.accepts('application/json')) {
              return res.status(200).send(song);
          }
        })
        .catch(err => {
            console.log(err);
            next(err);

        });

});
router.get('/', (req, res) => {
    if (!req.accepts('text/html') && !req.accepts('application/json')) {
        return res.status(406).send({
            err: 'Not valid type for asked resource'
        });
    }
    SongService.find(req.query)
        .then(songs => {
            if (!songs) {
                return res.statut(404).send({
                    err: "No song found"
                });
            }
            if (req.accepts('text/html')) {
                return res.render('songs', {
                    songs: songs
                });
            }
            if (req.accepts('application/json')) {
                return res.status(200).send(songs);
            }
        });
});
router.get('/add', (req, res) => {
  if (!req.accepts('text/html')) {
    return res.statut(404).send({
        err: "Not valid type for asked ressource"
    });
  }else{
      return res.render('songs/new');
    }
});

router.get('/artist/:artist', (req, res) => {
    SongService.findByArtist(req.params.artist)
        .then(songs => {
            res.status(200).send(songs);
        });
});
router.get('/edit/:id', (req, res) => {
    if (!req.accepts('text/html') && !req.accepts('application/json')) {
        return res.status(406).send({
            err: 'Not valid type for asked resource'
        });
    }
    SongService.findById(req.params.id)
        .then(song => {
            if (!song) {
                return res.status(404).send({
                    err: `id ${req.params.id} not found`
                });
            }
            if (req.accepts('text/html')) {
                return res.render('songs/edit', {
                    song: song
                });
            }
            if (req.accepts('application/json')) {
                return res.status(200).send(song);
            }
        });

});
router.get('/:id', (req, res) => {
    if (!req.accepts('text/html') && !req.accepts('application/json')) {
        return res.status(406).send({
            err: 'Not valid type for asked resource'
        });
    }
    SongService.findById(req.params.id)
        .then(song => {
            if (!song) {
                return res.status(404).send({
                    err: `id ${req.params.id} not found`
                });
            }
            if (req.accepts('text/html')) {
                return res.render('song', {
                    song: song
                });
            }
            if (req.accepts('application/json')) {
                return res.status(200).send(song);
            }
        });

});

router.put('/:id', (req, res) => {
    return SongService.update(req.body, req.params.id)
        .then(song => {
          if (req.accepts('text/html')) {
            return res.redirect(req.params.id);
          }
          if (req.accepts('application/json')) {
              return res.status(200).send(song);
          }
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.delete('/:id', (req, res) => {
    return SongService.destroy(req.params.id)
        .then(song => {
            res.status(201).send("Chanson supprimée");
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

module.exports = router;
