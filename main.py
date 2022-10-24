import json
import os

import jwt
from flask import Flask, jsonify, request
from flask_caching import Cache
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_sockets import Sockets
from werkzeug.security import check_password_hash, generate_password_hash

from dbnqs import Feed, MArticles, MUsers
from excrptions import (AccountExists, AccountNotFound,
                        CreateArticleTokenError, EditAuthDataError,
                        EmptyValuesAreEntered, SignupEmailError,
                        SignupLoginError)
from send_mail import send_message

app = Flask(__name__, template_folder="templates")
# Отмена кэширования статических файлов
app.config["CACHE_TYPE"] = "null"
# Инициализация кэша приложения
cache = Cache(app)
cache.init_app(app)
app.config['UPLOAD_FOLDER'] = "static/"
CORS(app)

app.secret_key = "FIYGRFERBKCYBKEUYVCYECERUYBCRU"
sockets = Sockets(app)
secret_key_for_images = "FHIRLUGIGYRERLVBUV132BJHVLYRFEHRCEBVKRRVJHBVB34"
# Secret_key из переменной окружения моего ноутбука.
# app.secret_key = str(subprocess.check_output(['launchctl', 'getenv', 'SECRET_KEY']))[2:-3]
url = "http://127.0.0.1:5000"

ma = Marshmallow(app)


class Article_m(ma.Schema):
    class Meta:
        fields = ['id', 'author_id', 'title', 'image', 'prev_content',
                  'content', 'category', 'tags', 'date', 'views']


article_m = Article_m(many=False)


class Articles_m(ma.Schema):
    class Meta:
        fields = ['id', 'author_id', 'title', 'image',
                  'prev_content', 'category', 'tags', 'date', 'views']


articles_m = Articles_m(many=True)


class Subscriptions_m(ma.Schema):
    class Meta:
        fields = ['subscription']


subscriptions_m = Subscriptions_m(many=True)


class Author_m(ma.Schema):
    class Meta:
        fields = ['login', 'avatar']


login_u = Author_m(many=False)

work_user = MUsers()
work_article = MArticles()
work_feed = Feed()



@app.route("/main_page", methods=["GET"])
def show_main_page():
    # token = jwt.decode(bytes(request.args.get("token", 1), encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    # print(token)
    # user_id = token["login"]
    articles = work_feed.get_most_recent_articles()
    result = articles
    return jsonify(result)


@app.route("/article/<int:article_id>", methods=["GET"])
def show_article(article_id):
    # token = jwt.decode(bytes(request.args.get("token", 1), encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    # print(token)
    article, author = work_article.get(article_id)
    result = article_m.dump(article)
    result["author"] = login_u.dump(author)
    # result["content"] = json.loads(result["content"])
    return jsonify(result)


@app.route('/my_subscriptions', methods=["GET"])
def show_subscriptions():
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    print(token)
    user_id = token["login"]
    print(f'Это user_id{user_id}')
    subscriptions = work_user.get_subscriptions(user_id)
    result = subscriptions_m.dumps(subscriptions)
    return jsonify(result)


@app.route('/tape', methods=["GET"])
def show_articles_by_subscriptions():
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    print(token)
    user_id = token["login"]
    articles = work_feed.get_articles_subscriptions(user_id)
    result = articles
    return jsonify(result)


@app.route('/user_articles/<login>', methods=["GET"])
def show_user_blog(login):
    # token = jwt.decode(bytes(request.args.get("token", 1), encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    # print(token)
    # user_id = token["login"]
    try:
        articles = work_feed.get_articles_blog(login)
        print(articles)
        result = articles
        # result["articles"] = json.loads(articles_m.dumps(articles))
        # print(result)
        # result["author"] = login_u.dump(author)
        return jsonify(result)
    except:
        return jsonify({'error': True})


@app.route('/my_articles', methods=["GET"])
def show_my_articles():
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    print(token)
    user_id = token["login"]
    articles = work_feed.get_articles_blog(user_id)
    print(articles)
    result = articles
    # result["articles"] = json.loads(articles_m.dumps(articles))
    # print(result)
    # result["author"] = login_u.dump(author)
    return jsonify(result)


@app.route('/edit/article', methods=["POST"])
def add_article():
    data = dict(request.form)
    token = data["token"]
    token = jwt.decode(bytes(token, encoding='utf-8'),
                       app.secret_key, algorithms=['HS256'])
    user_id = token["login"]
    print(token)
    title = data['title']
    prev_content = data['prev_content']
    content = data['content']
    category = data['category']
    tags = data['tags']
    try:
        file = request.files["image"]
        extens = file.filename.split(".")[-1].replace("\"", "")
        # Создаём имя файла, хэшируя его
        file_name = generate_password_hash(title + secret_key_for_images)
        # Убираем из названия все : и тп
        file_name = file_name.replace(":", "") + '.' + extens
        path = app.config["UPLOAD_FOLDER"]
        full_path = path + file_name
        print("Это full path: " + full_path)
    except:
        file_name = ''
    # info = []
    # info_dict = {}
    # for component in range(int(sorted(data)[-1][-1]) + 1):
    #     print(component)
    #     info_dict["id"] = data[f"id_{component}"]
    #     info_dict["type"] = data[f"type_{component}"]
    #     if info_dict["type"] !="text" and info_dict["type"] !="code":
    #         info_component = request.files[f"info_{component}"]
    #         extens = info_component.filename.split(".")[-1].replace("\"", "")
    #         filename = str(time.time()) + '.' + extens
    #         path = app.config["UPLOAD_FOLDER"]
    #         try:
    #             full_path = path + filename
    #             info_component.save(full_path)
    #             info_dict["info"] = f'http://127.0.0.1:5000{full_path}'
    #         except TypeError:
    #             pass
    #     else:
    #         info_dict["info"] = data[f"info_{component}"]
    #         if info_dict["type"] == "code":
    #             info_dict["pr_ln"] = data[f"pr_ln_{component}"]
    #     info.append(info_dict)
    #     info_dict = {}
    # info = json.dumps(info)
    try:
        article_id = work_article.add(
            user_id, title, file_name, prev_content, content, category, tags)
        print(article_id)
        try:
            file.save(os.path.join(path, file_name))
        except:
            pass
        return jsonify({"error": False, 'id': article_id})
    except EmptyValuesAreEntered:
        return jsonify({"error": 'EmptyValuesAreEntered'})
    except:
        return jsonify({"error": True})


@app.route('/subscription/<int:blog_id>', methods=["POST"])
def add_subscription(blog_id):
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    print(token)
    user_id = token["login"]
    subscriptions = work_user.get_subscriptions(user_id)
    if blog_id not in subscriptions:
        try:
            work_user.add_subscription(user_id, blog_id)
            return jsonify({"error": False})
        except:
            return jsonify({"error": True})
    else:
        return jsonify({"error": True})


@app.route('/article/<int:article_id>', methods=["DELETE"])
def del_article_(article_id):
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    user_id = token["login"]
    print(user_id)
    created_articles = work_user.get_articles_blog_by_user_id(user_id)
    articles = [i["id"]
                for i in json.loads(articles_m.dumps(created_articles))]
    admin = work_user.check_admin(user_id)
    print(created_articles)
    if article_id in articles or admin:
        work_article.remove(article_id)
        return jsonify({"error": False})
    else:
        return jsonify({"error": True})


@app.route('/subscription/<int:blog_id>', methods=["DELETE"])
def del_subscription_(blog_id):
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    user_id = token["login"]
    print(user_id)
    subscriptions = work_user.get_subscriptions(user_id)
    subscriptions_ = [i["blog_id"]
                      for i in json.loads(subscriptions_m.dumps(subscriptions))]
    admin = work_user.check_admin(user_id)
    if blog_id in subscriptions_ or admin:
        work_user.del_subscription(user_id, blog_id)
        return jsonify({"error": False})
    else:
        return jsonify({"error": True})


@app.route('/edit/article/<int:article_id>', methods=["PUT"])
def update_article_(article_id):
    data = dict(request.form)
    token = data["token"]
    token = jwt.decode(bytes(token, encoding='utf-8'),
                       app.secret_key, algorithms=['HS256'])
    user_id = token["login"]
    print(token)
    title = data['title']
    prev_content = data['prev_content']
    content = data['content']
    category = data['category']
    tags = data['tags']
    try:
        try:
            if data["image"] == "old":
                file_name = 'old'
        except:
            print('OLD_ERROR')
            file = request.files["image"]
            extens = file.filename.split(".")[-1].replace("\"", "")
            # Создаём имя файла, хэшируя его
            file_name = generate_password_hash(title + secret_key_for_images)
            # Убираем из названия все : и тп
            file_name = file_name.replace(":", "") + '.' + extens
            path = app.config["UPLOAD_FOLDER"]
            full_path = path + file_name
            print("Это full path: " + full_path)
    except:
        print('FILES_ERROR')
        file_name = ''
    # info = []
    # info_dict = {}
    # for component in range(int(sorted(data)[-1][-1]) + 1):
    #     print(component)
    #     info_dict["id"] = data[f"id_{component}"]
    #     info_dict["type"] = data[f"type_{component}"]
    #     if info_dict["type"] !="text" and info_dict["type"] !="code":
    #         info_component = request.files[f"info_{component}"]
    #         extens = info_component.filename.split(".")[-1].replace("\"", "")
    #         filename = str(time.time()) + '.' + extens
    #         path = app.config["UPLOAD_FOLDER"]
    #         try:
    #             full_path = path + filename
    #             info_component.save(full_path)
    #             info_dict["info"] = f'http://127.0.0.1:5000{full_path}'
    #         except TypeError:
    #             pass
    #     else:
    #         info_dict["info"] = data[f"info_{component}"]
    #         if info_dict["type"] == "code":
    #             info_dict["pr_ln"] = data[f"pr_ln_{component}"]
    #     info.append(info_dict)
    #     info_dict = {}
    # info = json.dumps(info)
    try:
        work_article.update(article_id, user_id, title, file_name,
                       prev_content, content, category, tags)
        try:
            file.save(os.path.join(path, file_name))
        except:
            pass
        return jsonify({"error": False})
    except CreateArticleTokenError:
        return jsonify({"error": 'CreateArticleTokenError'})
    except EmptyValuesAreEntered:
        return jsonify({"error": 'EmptyValuesAreEntered'})
    except:
        return jsonify({"error": True})


# Страница авторизации/регистрации/восстановления пароля/подтверждения нового пароля
@app.route('/authorization/<form>', methods=['POST'])
def post(form):
    if form == "log_in":
        email = request.json['email']
        password = request.json['password']
        try:
            forAction = request.json['forAction']
        except:
            forAction = ''
        try:
            email, password_hash_valid = work_user.request(email)
            bool_hash = check_password_hash(password_hash_valid, password)
        except AccountNotFound:
            return jsonify({"error": True})
        if bool_hash:
            avatar = work_user.request_avatar(email)
            user_id = work_user.get_id(email)
            admin = work_user.check_admin(user_id)
            login = work_user.get_login(email)
            is_confirmed_email = work_user.get_is_confirmed_email(email)
            token = jwt.encode(
                {'login': user_id}, key=app.secret_key, algorithm='HS256')
            print(token)
            if (forAction == 'change' and is_confirmed_email == True):
                try:
                    work_user.add_forgot_code(email)
                except AccountNotFound:
                    return jsonify({"error": "AccountNotFound"})
            return jsonify({'token': token, 'avatar': f"{avatar}", "admin": admin, "login": login})
        else:
            return jsonify({"error": True})

    elif form == "sign_up":

        login = request.json['login']
        email = request.json['email']
        password = request.json['password']
        try:
            work_user.add(login=login, email=email, password=password)
        except AccountExists:
            return jsonify({"error": True})
        except SignupEmailError:
            return jsonify({"error": 'SignupEmailError'})
        except SignupLoginError:
            return jsonify({"error": 'SignupLoginError'})
        except EmptyValuesAreEntered:
            return jsonify({"error": 'EmptyValuesAreEntered'})
        return jsonify({"error": False})


@app.route('/plus/view/<int:article_id>', methods=["GET"])
def plus_view(article_id):
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    print(token)
    login = token["login"]
    try:
        rez = work_article.plus_view(login, article_id)
        return jsonify({"error": False, "plus": rez})
    except:
        return jsonify({"error": True})


@app.route('/profile/<login>', methods=["GET"])
def view_user_profile(login):
    try:
        result = work_user.get_profile_info(login)
        return jsonify(result)
    except:
        return jsonify({'error': True})


@app.route('/edit_profile', methods=["POST"])
def edit_profile():
    data = dict(request.form)
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    print(token)
    login = token["login"]
    try:
        forgot_code = data["forgotCode"]
    except:
        pass
    try:
        old_email = data["oldEmail"]
        new_email = data["newEmail"]
        work_user.change_email(login, old_email, new_email, forgot_code)
        return jsonify({"error": False, "newEmail": True})
    except EmptyValuesAreEntered:
        return jsonify({"error": 'EmptyValuesAreEntered'})
    except EditAuthDataError:
        return jsonify({"error": 'EditAuthDataError'})
    except:
        pass

    try:
        old_password = data["oldPassword"]
        new_password = data["newPassword"]
        work_user.change_password(login, old_password, new_password, forgot_code)
        return jsonify({"error": False, "newPassword": True})
    except EmptyValuesAreEntered:
        return jsonify({"error": 'EmptyValuesAreEntered'})
    except:
        pass

    result = {"error": False}
    try:
        new_login = data["newLogin"]
        work_user.change_login(login, new_login)
        result['newLogin'] = new_login
    except EmptyValuesAreEntered:
        return jsonify({"error": 'EmptyValuesAreEntered'})
    except:
        pass

    try:
        file = request.files["image"]
        extens = file.filename.split(".")[-1].replace("\"", "")
        # Создаём имя файла, хэшируя его
        file_name = generate_password_hash(str(login) + secret_key_for_images)
        # Убираем из названия все : и тп
        file_name = file_name.replace(":", "") + '.' + extens
        path = app.config["UPLOAD_FOLDER"]
        full_path = path + file_name
    except:
        file_name = ''

    try:
        work_user.change_avatar(login, file_name)
        try:
            file.save(os.path.join(path, file_name))
        except:
            pass
        result['newImage'] = file_name
    except:
        return jsonify({"error": "POST /edit_profile: change_user_avatar(login, file_name)"})
    return jsonify(result)

@app.route('/delete_profile', methods=["POST"])
def delete_profile_():
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    user_id = token['login']
    try:
        forgot_code = request.json["forgotCode"]
        work_user.remove(user_id, forgot_code)
        return jsonify({'error': False})
    except:
      return jsonify({'error': True})

@app.route('/send_confirm_email', methods=["POST"])
def send_confirm_email():
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    user_id = token['login']
    try:
        toEmail = work_user.get_email(user_id)
    except:
        pass
    try:
        link = f'http://127.0.0.1:5000/confirm_email?token={request.args.get("token", 1)}'
        send_message(toEmail, "Подтверждение почты",
                     f"Для подтверждения почты прейдите по ссылке {link}")
        return jsonify({'error': False})
    except:
        return jsonify({'error': True})

@app.route('/confirm_email', methods=["GET"])
def confirm_email():
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    user_id = token['login']
    try:
        work_user.on_confirmed_email(user_id)
        return jsonify({'error': False})
    except:
        return jsonify({'error': True})


app.run()
