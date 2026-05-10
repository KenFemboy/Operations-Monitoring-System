import CustomerFeedbackForm from "../../features/feedback/components/CustomerFeedbackForm";
import { useParams } from "react-router-dom";

function CustomerFeedbackPage() {
  const { branchSlug } = useParams();

  return (
    <div style={styles.page}>
      <CustomerFeedbackForm branchSlug={branchSlug || ""} />
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
