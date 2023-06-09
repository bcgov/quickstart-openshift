import MUIDataTable from 'mui-datatables'

const columns = ['Name', 'Company', 'City', 'State']

const data = [
  ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
  ['John Walsh', 'Test Corp', 'Hartford', 'CT'],
  ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
  ['James Houston', 'Test Corp', 'Dallas', 'TX'],
  ['Prabhakar Linwood', 'Test Corp', 'Hartford', 'CT'],
  ['Kaui Ignace', 'Test Corp', 'Yonkers', 'NY'],
  ['Esperanza Susanne', 'Test Corp', 'Hartford', 'CT'],
  ['Christian Birgitte', 'Test Corp', 'Tampa', 'FL'],
  ['Meral Elias', 'Test Corp', 'Hartford', 'CT'],
]

export default function Dashboard() {
  return <MUIDataTable title={'User List'} data={data} columns={columns} />
}
