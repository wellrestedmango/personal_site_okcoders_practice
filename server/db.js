//uses the supabase package to get the createClient connection to supabase
const { createClient } = require('@supabase/supabase-js')


//grabbing env var
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY 

//used the imported createClient method to create a supabase instance to access its methods
//uses our key and url to make the client with access to our personal supabase data
const supabase = createClient(supabaseUrl, supabaseKey)


//lets us use supabase elsewhere in the program 
module.exports = supabase;