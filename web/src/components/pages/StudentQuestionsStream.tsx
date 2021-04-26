import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Store } from '../../types/store';

export default () => {
  const student = useSelector((state: Store) => state.student);  
  const { classId } = useParams<any>();

  if (student === undefined) {
    return <>You're not logged in!</>;
  }

  return <>"hello worldaaa"</>;
};
