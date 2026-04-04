from App import create_app

config_app = create_app()
if __name__ == '__main__':
    config_app.run(debug=True,port=5000)