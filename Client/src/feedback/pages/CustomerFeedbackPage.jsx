import CustomerFeedbackForm from "../components/CustomerFeedbackForm";

function CustomerFeedbackPage() {
  return (
    <div style={styles.page}>
      <CustomerFeedbackForm />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    padding: "20px",
  },
};

export default CustomerFeedbackPage;