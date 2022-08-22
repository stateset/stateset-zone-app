import { connectStateResults } from 'react-instantsearch-dom';

const NoResults = ({ searchState, searchResults, searching }) =>
  searchState &&
  searchState.query &&
  !searching &&
  (searchResults && searchResults.nbHits === 0) ? (
    <div className="no-results">
      No results for <span>&quot;{searchResults.query}&quot;</span>.<br /> Please Try again with a
      different keyword.
      <style jsx>{`
        .no-results {
          background: #FFFFFF;
          padding: 2rem;
          margin-top: 50px;
          color: #425A70
          font-size: 2rem;
          text-align: left;
          width: 700px;
        }
      `}</style>
    </div>
  ) : null;


export default connectStateResults(NoResults);