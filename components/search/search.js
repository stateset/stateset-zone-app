import { memo } from 'react';
import {
  RefinementList,
  Configure,
  Highlight,
  Pagination,
  Index,
  InstantSearch,
} from 'react-instantsearch-dom';
import Link from 'next/link'
import algoliasearch from 'algoliasearch/lite';
import PropTypes from 'prop-types';
import { connectHits, connectSearchBox, connectStateResults } from 'react-instantsearch-dom';
import {
  BadgeCheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CollectionIcon,
  SearchIcon,
  SortAscendingIcon,
  StarIcon,
} from '@heroicons/react/solid'

const searchClient = algoliasearch(process.env.NEXT_PUBLIC_SEARCH_ID, process.env.NEXT_PUBLIC_SEARCH_KEY);

const PurchaseOrderHits = ({ hits }) => (

  <ul class="list-none">
    {hits.map(hit => (
          
      <li key={hit.objectID}>
      <div className="rounded-lg px-3 py-3 hover:bg-gray-100 relative focus-within:ring-2 focus-within:ring-blue-500 z-50">
        <h3 className="text-base font-semibold text-gray-800">
          <a className="hover:underline focus:outline-none">
            <Link href='/puchaseorder/[id]' as={`/purchaseorder/${hit.id}`}>{hit.did}</Link>
          </a>
        </h3>
        <p className="mb-3 mt-1 text-base text-gray-600 line-clamp-2">{hit.did}- Amount: {hit.amount} - State: {hit.state}</p>
      </div>
    </li>
    ))}
  </ul>
);


const LoanHits = ({ hits }) => (

  <ul class="list-none">
    {hits.map(hit => (
          
      <li key={hit.objectID}>
      <div className="rounded-lg px-3 py-3 hover:bg-gray-100 relative focus-within:ring-2 focus-within:ring-blue-500 z-50">
        <h3 className="text-base font-semibold text-gray-800">
          <a className="hover:underline focus:outline-none">
            <Link href='/loan/[id]' as={`/loan/${hit.id}`}>{hit.id}</Link>
          </a>
        </h3>
        <p className="mb-3 mt-1 text-base text-gray-600 line-clamp-2">{hit.id}- amount: {hit.amount} - State: {hit.state}</p>
      </div>
    </li>
    ))}
  </ul>
);

const InvoiceHits = ({ hits }) => (

  <ul class="list-none">
    {hits.map(hit => (
          
      <li key={hit.objectID}>
      <div className="rounded-lg px-3 py-3 hover:bg-gray-100 relative focus-within:ring-2 focus-within:ring-blue-500 z-50">
        <h3 className="text-base font-semibold text-gray-800">
          <a className="hover:underline focus:outline-none">
            <Link href='/invoice/[id]' as={`/invoice/${hit.id}`}>{hit.id}</Link>
          </a>
        </h3>
        <p className="mb-3 mt-1 text-base text-gray-600 line-clamp-2">{hit.id}- Amount: {hit.amount} - State: {hit.state}</p>
      </div>
    </li>
    ))}
  </ul>
);


const SearchBox = ({ currentRefinement, refine }) => (
  <div className="w-full px-2 lg:px-6">
    <label htmlFor="search" className="sr-only">
      Search Stateset
                </label>
    <div className="relative text-blue-200 focus-within:text-white">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5" aria-hidden="true" />
      </div>
      <input
        id="search"
        name="search"
        className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 text-blue-100 placeholder-blue-200 focus:outline-none focus:bg-white focus:ring-0 focus:placeholder-gray-400 focus:text-gray-900 sm:text-base"
        value={currentRefinement} onChange={event => refine(event.currentTarget.value)}
        placeholder="Search Stateset..."
        type="search"
      />
    </div>
  </div>

);

const CustomSearchBox = connectSearchBox(SearchBox);
const CustomPurchaseOrderHits = connectHits(PurchaseOrderHits);
const CustomInvoiceHits = connectHits(InvoiceHits);
const CustomLoanHits = connectHits(LoanHits);

const IndexResults = connectStateResults(
  ({ searchState, searchResults, children }) =>
    searchResults && searchResults.nbHits !== 0 && searchState.query ? (
      children
    ) : (
        <div>
          {searchResults ? ' ' : ''}
        </div>
      )
);

const AllResults = connectStateResults(({ allSearchResults, children }) => {
  const hasResults =
    allSearchResults &&
    Object.values(allSearchResults).some(results => results.nbHits > 0);
  return !hasResults ? (
    <div>
      <Index indexName="prod_STATESET_ZONE_PURCHASEORDERS" />
      <Index indexName="prod_STATESET_ZONE_INVOICES" />
      <Index indexName="prod_STATESET_ZONE_LOANS" />
    </div>
  ) : (
      children
    );
});

export default class extends React.Component {
  static propTypes = {
    searchState: PropTypes.object,
    resultsState: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onSearchStateChange: PropTypes.func,
    createURL: PropTypes.func,
    indexName: PropTypes.string,
    searchClient: PropTypes.object,
  };

  render() {
    return (
      <InstantSearch searchClient={searchClient} indexName={this.props.indexName} {...this.props}>
        <Configure hitsPerPage={1} />
        <div class="static">
        <CustomSearchBox />
        <div class="border-solid border-2 border-white rounded-lg px-3 bg-white absolute mt-3 ml-5 w-7/12 z-40">
          <AllResults>
            <div>
              <Index indexName="prod_STATESET_ZONE_PURCHASEORDERS">
                <IndexResults>
                  <div>
                    <CustomPurchaseOrderHits />
                  </div>
                </IndexResults>
              </Index>
              <Index indexName="prod_STATESET_ZONE_INVOICES">
                <IndexResults>
                  <div>
                    <CustomInvoiceHits />
                  </div>
                </IndexResults>
              </Index>
              <Index indexName="prod_STATESET_ZONE_LOANS">
                <IndexResults>
                  <div>
                    <CustomLoanHits />
                  </div>
                </IndexResults>
              </Index>
            </div>
          </AllResults>
          </div>
          </div>
      </InstantSearch>
    );
  }
}
