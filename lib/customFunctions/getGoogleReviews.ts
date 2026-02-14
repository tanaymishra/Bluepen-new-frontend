export async function getGoogleReviews(pageToken: string | null = null) {
  const GOOGLE_PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
  const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  let allReviews: GoogleReview[] = [];
  let nextPageToken: string | null = pageToken;

  try {
    do {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=reviews&key=${GOOGLE_PLACES_API_KEY}${nextPageToken ? `&pagetoken=${nextPageToken}` : ''}`,
        { next: { revalidate: 3600 } }
      );

      const data = await response.json();
      const reviews = data?.result?.reviews || [];
      allReviews = allReviews.concat(reviews);
      nextPageToken = data.next_page_token || null;

      // Google API requires a short delay before using the next_page_token
      if (nextPageToken) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } while (nextPageToken);

    return { reviews: allReviews, nextPageToken: null };
  } catch (error) {
    console.error('Failed to fetch Google reviews:', error);
    return { reviews: [], nextPageToken: null };
  }
}

export interface GoogleReview {
  author_name: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
}