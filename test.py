# res = []
# n = 30
# count = 0

# for i in range(2, n):
#     for j in range(2, i + 1):
#         if i % j == 0:
#             if i == j:
#                 count += 1
#             break
# print(count)

# string = ['d', 's', 'd', 'k', 'n', 'q', 'k', 'A', 'b', 'b', 'l', 'a', 'n', 'X',
#           'j', 'k', 'd', 'n', 'd', 'h', 's', 'b', 'd', 'b', 'c', 'd', 'j', 'd', 'k', 'd']


# container = [[], [], [], [], [], [], [], [], [], [], [], [],
#              [], [], [], [], [], [], [], [], [], [], [], [], [], []]
# result = []

# for i in string:
#     if 97 <= ord(i) <= 122:
#         container[ord(i) - 97].append(i)
#     if 65 <= ord(i) <= 90:
#         container[ord(i) - 65].insert(0, i)

# for c in container:
#     for s in c:
#         result.append(s)

# print(result)


# m = [3, 4, 5, 6, 7, 8, 9, 1, 2]
# # m = [1, 2, 3, 4, 5, 6, 7, 8, 9]

# max = None

# for i in range(len(m)):
#     if i == len(m) - 1:
#         max = m[i]
#         break
#     if m[i] > m[i + 1]:
#         max = m[i]
#         break
# print(max)


t = {
    'value': 24,  # root
    'left': {
        'value': 19,  # 1
        'left': {
            'value': 15,  # 2
            'left': {
                'value': 10,  # 3
                'left': None,
                'right': None,
            },
            'right': {
                'value': 16,  # 3
                'left': None,
                'right': None,
            },
        },
        'right': {
            'value': 22,  # 2
            'left': {
                'value': 20,  # 3
                'left': None,
                'right': None,
            },
            'right': {
                'value': 27,  # 3
                'left': {},
                'right': {},
            },
        },
    },
    'right': {
        'value': 28,  # 1
        'left': {
            'value': 27,  # 2
            'left': {
                'value': 7,  # 3
                'left': None,
                'right': None,
            },
            'right': {
                'value': 29,  # 3
                'left': None,
                'right': None,
            },
        },
        'right': {
            'value': 30,  # 2
            'left': {
                'value': 11,  # 3
                'left': None,
                'right': None,
            },
            'right': {
                'value': 40,  # 3
                'left': None,
                'right': None,
            },
        },
    },
}

k = {
    'value': 24,  # root
    'left': {
        'value': 19,  # 1
        'left': {
            'value': 15,  # 2
            'left': {
                'value': 10,  # 3
                'left': None,
                'right': None,
            }
        },
        'right': {
            'value': 22,  # 2
            'left': {
                'value': 20,  # 3
                'left': None,
                'right': None,
            },
            'right': {
                'value': 27,  # 3
                'left': None,
                'right': None,
            },
        },
    },
    'right': {
        'value': 28,  # 1
        'left': None,
        'right': {
            'value': 30,  # 2
            'left': {
                'value': 11,  # 3
                'left': None,
                'right': None,
            },
            'right': {
                'value': 40,  # 3
                'left': None,
                'right': None,
            },
        },
    },
}


def isBitaryTree(tree):

    if not tree['left'] and not tree['right']:
        return True

    if tree['left']:
        if tree['value'] <= tree['left']['value']:
            return False
    if tree['right']:
        if tree['value'] >= tree['right']['value']:
            return False
    return isBitaryTree(tree['left']) and isBitaryTree(tree['right'])


print(isBitaryTree(k))
