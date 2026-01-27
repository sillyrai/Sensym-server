const express = require('express');

// ------------------------- Route setup -------------------------

const router = express.Router();

const viewFolder = 'sensors';

// ------------------------- Helper func. -------------------------


// ------------------------- Routes -------------------------

router.get('/', async (req:any, res:any) => {
    res.render(viewFolder, {title: "Test"});
});

// ------------------------- Router export -------------------------

export default router;
