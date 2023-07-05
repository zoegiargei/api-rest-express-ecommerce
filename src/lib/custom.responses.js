export const customResponses = (req, res, next) => {
    res.sendOk = result => {
        res.status(200).json({ status: 'success', message: result.message, object: result.object })
    }

    res.sendCreated = result => {
        res.status(201).json({ status: 'success', message: result.message, object: result.object })
    }

    res.sendAccepted = result => {
        res.status(202).json({ status: 'success', message: result.message, object: result.object })
    }

    res.sendNoContent = result => {
        res.status(204).json({ status: 'Success', message: result.message, object: result.object })
    }

    res.sendClientError = error => {
        res.status(error.status).json({ status: 'error', message: error.message, details: error.details || null })
    }

    res.sendServerError = error => {
        res.status(error.status).json({ status: 'error', message: error.message, details: error.details || null })
    }

    res.sendAuthenticationError = error => {
        res.status(error.status).json({ status: 'error', message: error.message, details: error.details || null })
    }

    res.sendPermissionsError = error => {
        res.status(error.status).json({ status: 'error', message: error.message, details: error.details || null })
    }

    res.sendInvalidOperation = error => {
        res.status(error.status).json({ status: 'error', message: error.message, details: error.details || null })
    }

    next()
}
