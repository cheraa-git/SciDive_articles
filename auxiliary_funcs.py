from random import randint

def generate_c_c():
    c_c = ''
    for i in range(6):
        c_c += str(randint(0, 9))
    return c_c