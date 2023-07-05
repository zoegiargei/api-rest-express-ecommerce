import ApiError from '../models/Error/api.error.js'

const errors = {}
errors.ApiError = ApiError

errors.permission_failes = new ApiError(401, 'UNAUTHORIZED', 'You are not allow to get the resource')
errors.forbidden = new ApiError(403, 'NOT_ALLOWED', 'You are not allow to get the resource')
errors.required_key = new ApiError(400, 'REQUIRED_KEY','Api key is required. Please provide a valid api key along with request.')
errors.required_auth = new ApiError(400, 'REQUIRED_AUTH_TOKEN','Auth Token is required. Please provide a valid auth token along with request.')
errors.invalid_input = new ApiError(400, 'INVALID_INPUT','The request input is not as expected by API. Please provide valid input.')
errors.invalid_input_format = new ApiError(400, 'INVALID_INPUT_FORMAT','The request input format is not allowed.')
errors.invalid_key = new ApiError(401, 'INVALID_KEY','Valid api key is required. Please provide a valid api key along with request.')
errors.invalid_auth = new ApiError(401, 'INVALID_AUTH','Valid auth token is required. Please provide a valid auth token along with request.')
errors.invalid_permission = new ApiError(401, 'INVALID_PERMISSION','Permission denied. Current user does not has required permissions for this resource.')
errors.invalid_access = new ApiError(401, 'INVALID_ACCESS','Access denied. Current user does not has access for this resource.')
errors.invalid_operation = new ApiError(403, 'INVALID_OPERATION','Requested operation is not allowed due to applied rules. Please refer to error details.')
errors.not_found = new ApiError(404, 'NOT_FOUND','The resource referenced by request does not exists.')
errors.not_registeration = new ApiError(404, 'NOT_REGISTERATION','User not registered with this email/mobile.')
errors.input_too_large = new ApiError(406, 'INPUT_TOO_LARGE','The request input size is larger than allowed.')
errors.authentication_failed = new ApiError(407, 'PROXY AUTHENTICATION REQUIRED', 'You are not authenticated.')
errors.conflict = new ApiError(409, 'CONFLICT', 'The request conflict with the current state of the target resource.')
errors.internal_error = new ApiError(500, 'INTERNAL_ERROR','Something went wrong on server. Please contact server admin.')

export default errors