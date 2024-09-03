// pages/contact-us/[name].js
"use client"
export async function getServerSideProps(context) {
  const { name } = context.params;
  const res = await axios.get('http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/v1/footer-pages');
  const footerData = res.data.data;

  return {
    props: {
      name,
      footerData,
    },
  };
}

const ContactUs = ({ name, footerData }) => {
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(false);
  }, [footerData]);

  const truncateMetaDescription = (description) => {
    if (description.length > metaDescriptionLimit) {
      return description.substring(0, metaDescriptionLimit) + '...';
    }
    return description;
  };

  if (loader) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="footer-all-pages-display">
        {footerData.map((item) =>
          item.pages.map((innerItem) =>
            name === '/' + innerItem.slug && (
              <div
                key={innerItem.slug}
                className={item.name === 'BRAND' ? innerItem?.slug : ''}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(innerItem.content),
                }}
              ></div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default ContactUs;
