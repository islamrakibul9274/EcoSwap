import { MetadataRoute } from 'next';
import connectToDatabase from '@/lib/db';
import Listing from '@/models/Listing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ecoswap.community';

  // Base routes with a guaranteed valid date
  const routes: MetadataRoute.Sitemap = [
    '',
    '/plants',
    '/leaderboard',
    '/about',
    '/contact',
    '/faq',
    '/how-it-works',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    await connectToDatabase();

    // Fetch available plants
    const plants = await Listing.find({ status: 'Available' })
      .select('_id updatedAt')
      .lean();

    const plantRoutes = plants.map((plant: any) => {
      // Robust Date validation to prevent the RangeError
      const validDate = plant.updatedAt && !isNaN(new Date(plant.updatedAt).getTime())
        ? new Date(plant.updatedAt)
        : new Date(); // Fallback to current time if DB date is missing or invalid

      return {
        url: `${baseUrl}/plants/${plant._id}`,
        lastModified: validDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      };
    });

    return [...routes, ...plantRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    // Return only base routes if the DB connection or query fails
    return routes;
  }
}