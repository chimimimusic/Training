import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function checkSchema() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // Check modules table structure
    const [columns] = await connection.query('DESCRIBE modules');
    console.log('Modules table columns:');
    columns.forEach(col => {
      console.log(`  ${col.Field} (${col.Type})`);
    });
    
    // Check if moduleSections table exists and its structure
    console.log('\nModuleSections table columns:');
    const [sectionColumns] = await connection.query('DESCRIBE moduleSections');
    sectionColumns.forEach(col => {
      console.log(`  ${col.Field} (${col.Type})`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkSchema();
