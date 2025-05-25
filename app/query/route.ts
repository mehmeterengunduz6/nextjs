import postgres from 'postgres';

// Update database connection configuration
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false
});

async function listInvoices() {
  try {
    const data = await sql`
      SELECT 
        invoices.amount, 
        customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;
    
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function GET() {
  try {
    const data = await listInvoices();
    return Response.json(data);
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  } finally {
    // Ensure the database connection is closed
    await sql.end();
  }
}
