// Public customer routes.
import { Route, Routes } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";
import CustomerFeedbackPage from "../../public/feedback/CustomerFeedbackPage";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<CustomerFeedbackPage />} />
        <Route path=":branchSlug" element={<CustomerFeedbackPage />} />
      </Route>
    </Routes>
  );
}
