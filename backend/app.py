from flask import Flask, jsonify, request, send_from_directory

app = Flask(
    __name__,
    static_folder="../frontend",
    static_url_path=""
)

leave_requests = []

# Serve the frontend website
@app.route("/")
def home():
    return send_from_directory(app.static_folder, "index.html")

# Submit a leave request
@app.route("/leaves", methods=["POST"])
def submit_leave():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "JSON data is required"}), 400

    required_fields = [
        "employee_name",
        "leave_type",
        "start_date",
        "end_date",
        "reason"
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "error": f"{field} is required"
            }), 400

    if data["end_date"] < data["start_date"]:
        return jsonify({
            "error": "End date cannot be before start date"
        }), 400

    leave = {
        "id": len(leave_requests) + 1,
        "employee_name": data["employee_name"],
        "leave_type": data["leave_type"],
        "start_date": data["start_date"],
        "end_date": data["end_date"],
        "reason": data["reason"],
        "status": "Pending"
    }

    leave_requests.append(leave)

    return jsonify({
        "message": "Leave request submitted successfully",
        "leave": leave
    }), 201

# View all leave requests
@app.route("/leaves", methods=["GET"])
def get_leaves():
    return jsonify(leave_requests)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
