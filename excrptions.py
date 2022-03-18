class AccountNotFound(Exception):
    '''
    Authentification pair not found in db
    '''

class AccountExists(Exception):
    '''
    Authentification pair already in db
    '''

class SignupLoginError(Exception):
    '''
    Authentification login already in db
    '''

class SignupEmailError(Exception):
    '''
    Authentification email already in db
    '''

class EmptyValuesAreEntered(Exception):
    '''
    Empty values are entered
    '''

class CreateArticleTokenError(Exception):
    '''
    Invalid author token
    '''

class EditAuthDataError(Exception) :
  '''
  asfd
  '''