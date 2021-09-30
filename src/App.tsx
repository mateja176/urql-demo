import React from 'react';
import { gql, OperationContext, useMutation, useQuery } from 'urql';
import './App.css';
import { SoilAnalysis, SoilAnalysisUpdateInput } from './types';

const id = process.env.REACT_APP_ID;
if (!id) {
  throw new Error('No ID provided.');
}
const authorization = process.env.REACT_APP_AUTHORIZATION;
if (!authorization) {
  throw new Error('No AUTHORIZATION provided.');
}

const context: Partial<OperationContext> = {
  fetchOptions: {
    headers: {
      authorization,
    },
  },
};

const SoilAnalysisFragment = gql`
  fragment SoilAnalysisFragment on SoilAnalysis {
    id
    name
  }
`;

const query = gql`
  query SoilAnalysisQuery($id: String!) {
    soilAnalysis(id: $id) {
      ...SoilAnalysisFragment
    }
  }
  ${SoilAnalysisFragment}
`;

const mutation = gql`
  mutation SoilAnalysisMutation(
    $soilAnalysisUpdateInput: SoilAnalysisUpdateInput!
  ) {
    updateSoilAnalysis(soilAnalysisUpdateInput: $soilAnalysisUpdateInput) {
      ...SoilAnalysisFragment
    }
  }
  ${SoilAnalysisFragment}
`;

function App() {
  const [name, setName] = React.useState('');

  const [{ data }] = useQuery<
    { soilAnalysis: SoilAnalysis },
    Pick<SoilAnalysis, 'id'>
  >({
    query,
    variables: { id: id! },
    context,
  });
  React.useEffect(() => {
    if (data) {
      setName(data.soilAnalysis.name);
    }
  }, [data]);

  const [, updateSoilAnalysis] = useMutation<
    { updateSoilAnalysis: SoilAnalysis },
    { soilAnalysisUpdateInput: SoilAnalysisUpdateInput }
  >(mutation);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    setName(value);
  };

  const canUpdate = name !== data?.soilAnalysis.name;

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (canUpdate) {
    }
    updateSoilAnalysis(
      {
        soilAnalysisUpdateInput: {
          id: id!,
          name,
        },
      },
      context,
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Soil Analysis Name: {data?.soilAnalysis.name}</h1>
      <input value={name} onChange={handleChange} />
      <button type="submit" disabled={!canUpdate}>
        Submit
      </button>
    </form>
  );
}

export default App;
