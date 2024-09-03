
import DetailRingPageClient from './DetailRingPageClient';

async function fetchDataFromAPI(detailRingPage) {
  const response = await fetch(`http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/v1/footer-pages`);
  const data = await response.json();
  console.log(data);
  
  return data;
}

export async function generateMetadata({ params }) {
  const data = await fetchDataFromAPI(params.detailRingPage);

  if (Array.isArray(data.data)) {
    const metadata = data.data.map((item) => ({
      title: item.name || "Default Title",
      description: item.description || "Default Description", 
    }))[0]; 

    return metadata;
  }

  return {
    title: "Default Title",
    description: "Default Description",
  };
}

export default async function DetailRingPage({ params }) {
  const data = await fetchDataFromAPI(params.detailRingPage);

  return (
    <div>
      <DetailRingPageClient data={data} />
    </div>
  );
}
