const { RoutineController }  = require('../../controllers');
const { Auth } = require('../../middlewares');

const router = require('express').Router();

// PROTECTED BY AUTH MIDDLEWARE

router.post(
    '/',
    [Auth.EnsureIsAuthenticated("customer")], 
    RoutineController.createRoutine
);

router.put(
    '/:routineRefId',
    [Auth.EnsureIsAuthenticated("customer")], 
    RoutineController.updateRoutine
);

router.post(
    '/timestamps/:routineRefId',
    [Auth.EnsureIsAuthenticated("customer")], 
    RoutineController.addTimestampsToRoutine
);

router.patch(
    '/pause/:routineRefId',
    [Auth.EnsureIsAuthenticated("customer")], 
    RoutineController.pauseRoutine
);

router.patch(
    '/unpause/:routineRefId',
    [Auth.EnsureIsAuthenticated("customer")], 
    RoutineController.unPauseRoutine
);

router.delete(
    '/:routineRefId',
    [Auth.EnsureIsAuthenticated("customer")],  
    RoutineController.deleteRoutine
);

router.delete(
    '/timestamp/:routineRefId',
    [Auth.EnsureIsAuthenticated("customer")],  
    RoutineController.removeTimestampFromRoutine
);

module.exports = router;