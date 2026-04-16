from App.Nutritionist.decorators import nutritionist_required
from flask import Blueprint

bp_nutritionist = Blueprint('nutritionist', __name__, url_prefix='/nutritionist')

@bp_nutritionist.route('/profile', methods=['GET'])
@nutritionist_required
def get_profile():
    pass

@bp_nutritionist.route('/dashboard', methods=['GET'])
@nutritionist_required
def get_dashboard_data():
    pass

@bp_nutritionist.route('/dashboard', methods=['PUT'])
@nutritionist_required
def update_dashboard_data():
    pass

@bp_nutritionist.route('/dashboard', methods=['POST'])
@nutritionist_required
def create_dashboard_data():
    pass

@bp_nutritionist.route('/dashboard', methods=['DELETE'])
@nutritionist_required
def delete_dashboard_data():
    pass

