const SuccessAlert = ({ title }) => {
  return (
    <div className="alert alert-success">
      <div className="flex-1">
        <label>{title} Success</label>
      </div>
    </div>
  );
};

export default SuccessAlert;
