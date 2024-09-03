// app/[footerPages]/page.tsx

import ContactUs from "./fetchFooter"; // Adjust the path as needed

// Fetch data for static paths
export async function generateStaticParams() {
  const posts = await fetchFooterData();
  
  // Generate paths based on fetched data
  const paths = posts.map(post => ({
    params: { footerPages: post.id } // Adjust according to your actual data structure
  }));

  return {
    paths,
    fallback: false // or true/‘blocking’ if you need fallback behavior
  };
}

// Function to fetch footer data
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

// Page Component
const ContactPage = ({ params }) => {
  const [posts, setPosts] = React.useState([]);
  
  React.useEffect(() => {
    // Fetch data on client side as `generateStaticParams` is for build time
    const fetchData = async () => {
      const data = await fetchFooterData();
      setPosts(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <ContactUs posts={posts} />
    </div>
  );
};

export default ContactPage;
