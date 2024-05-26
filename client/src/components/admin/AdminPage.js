import React from "react";

const AdminPage = ({ isAdmin }) => {
    if (!isAdmin) {
        return <div>Access Denied</div>;
    }

    return (
        <div className="admin">
            <h1>Admin Page</h1>
            <p>Welcome to the admin page.</p>
        </div>
    );
};

export default AdminPage;
