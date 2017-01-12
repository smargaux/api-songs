const router = require('express').Router();
const SongService = require('../services/songs');
const _ = require("lodash");

router.post('/', (req, res) => {
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
            res.status(201).send(song);
        })
        .catch(err => {
            res.status(500).send(err);
        });

});
router.get('/', (req, res) => {
    SongService.find(req.query)
        .then(songs => {
            res.status(200).send(songs);
        });
});

router.get('/artist/:artist', (req, res) => {
    SongService.findByArtist(req.params.artist)
        .then(songs => {
            res.status(200).send(songs);
        });
});

router.get('/:id', (req, res) => {
    SongService.findById(req.params.id)
        .then(songs => {
            res.status(200).send(songs);
        })
        .catch(err => {
            res.status(500).send(err);
        });


});

router.put('/:id', (req, res) => {
  return SongService.update(req.body, req.params.id)
      .then(song => {
          res.status(201).send(song);
      })
      .catch(err => {
          res.status(500).send(err);
      });
});

router.delete('/:id', (req, res) => {
  return SongService.destroy(req.params.id)
      .then(() => {
          res.status(201).send("Chanson supprimée");
      })
      .catch(err => {
          res.status(500).send(err);
      });
});

module.exports = router;
