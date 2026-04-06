const API_KEY = process.env.EXCHANGERATE_API_KEY;

export async function getLatestRates() {
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) throw new Error('Failed to fetch rates');

    const data = await response.json();

    return data.conversion_rates;
  } catch (error) {
    console.error('Rate Service Error:', error);
    return null;
  }
}
