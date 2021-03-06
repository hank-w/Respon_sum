import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Space, Typography, Button } from 'antd';
import { getClassesByInstructorId } from '../../../api/instructors';
import { addInstructorToClass, removeInstructorFromClass, getAllClasses } from '../../../api/classes';
import { Class } from '../../../types/api';
import { Store } from '../../../types/store';

import ClassView from '../../ClassView';

const { Title } = Typography;

export default () => {
  const [yourClasses, setYourClasses] = useState<Class[]>([]);
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [loadingYourClasses, setLoadingYourClasses] = useState(false);
  const [loadingAllClasses, setLoadingAllClasses] = useState(false);
  const [loadingJoinClass, setLoadingJoinClass] = useState(false);
  const [loadingDeleteClass, setLoadingDeleteClass] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const alreadyJoined = (clazz: Class) => yourClasses.some(c => c.id == clazz.id);
  const canJoinClass = (clazz: Class) => clazz.active && !alreadyJoined(clazz);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>All Classes</Title>
        {loadingAllClasses ? 'Loading...' : null}
        {allClasses.map(clazz => (
          <ClassView clazz={clazz} key={clazz.id}>
            <Button type="primary" size="large" disabled={!canJoinClass(clazz)}
             loading={loadingJoinClass}>
              {
                canJoinClass(clazz) ? 'Active' : (
                  alreadyJoined(clazz) ? 'Active' : 'Not active'
                )
              }
            </Button>
          </ClassView>
        ))}
      </div>
      <span style={{color:'red'}}>{error}</span>
    </Space>
  );
};
