import ContactUs from "./fetchFooter";


const fetchFooterData = async () => {
    let posts = [];
    try {
      const response = await fetch(
        "http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/v1/footer-pages"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      posts = await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return posts;
};

const ContactPage = async () => {
    const posts = await fetchFooterData();
    return (
        <div>
            <ContactUs posts={posts} />
        </div>
    );
};

export default ContactPage;