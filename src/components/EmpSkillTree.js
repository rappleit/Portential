import React, { useEffect, useRef } from 'react';
import {
  SkillTreeGroup,
  SkillTree,
  SkillProvider,
  SkillType
} from 'beautiful-skill-tree';

/**@type {SkillType} */
const leaderCommSkill = {
  id: 'comm-leader',
  title: 'Superior Communication',
  tooltip: {
    content: 'something'
  },
  children: []
};

/**@type {SkillType} */
const peerCommSkill = {
  id: 'comm-peer',
  title: 'Peer Communication',
  tooltip: {
    content: 'something'
  },
  children: []
};

/**@type {SkillType} */
const subCommSkill = {
  id: 'comm-sub',
  title: 'Employee Communication',
  tooltip: {
    content: 'something'
  },
  children: []
};

/**@type {SkillType} */
const commSkill = {
  id: 'comm',
  title: 'Communication',
  tooltip: {
    content: 'something'
  },
  children: [leaderCommSkill, peerCommSkill, subCommSkill]
};

/**@type {SkillType} */
const timeSkill = {
  id: 'time',
  title: 'Time Management',
  tooltip: {
    content: 'something'
  },
  children: []
};

/**@type {SkillType} */
const stressReliefSkill = {
  id: 'stress-relief',
  title: 'Stress Relief',
  tooltip: {
    content: 'something'
  },
  children: []
};

/**@type {SkillType} */
const stressSkill = {
  id: 'stress',
  title: 'Managing Stress',
  tooltip: {
    content: 'something'
  },
  children: [timeSkill, stressReliefSkill]
};

/**@type {SkillType} */
const awareSkill = {
  id: 'self-aware',
  title: 'Self-Awareness',
  tooltip: {
    content: 'something'
  },
  children: []
};

/**@type {SkillType} */
const motivationSkill = {
  id: 'self-motivation',
  title: 'Motivation',
  tooltip: {
    content: 'something'
  },
  children: []
};

/**@type {SkillType} */
const trustSkill = {
  id: 'trust',
  title: 'Trustworthiness',
  tooltip: {
    content: 'something'
  },
  children: []
};

/**@type {SkillType} */
const selfSkill = {
  id: 'self',
  title: 'Self Management',
  tooltip: {
    content: 'something'
  },
  children: [awareSkill, motivationSkill, trustSkill]
};

/**@type {SkillType} */
const empathySkill = {
  id: 'empathy',
  title: 'Empathy',
  tooltip: {
    content: 'something'
  },
  children: []
};

/**@type {SkillType} */
const teamworkSkill = {
  id: 'teamwork',
  title: 'Teamwork',
  tooltip: {
    content: 'something'
  },
  children: [commSkill, empathySkill]
};

/**@type {SkillType} */
const softSkill = {
  id: 'soft-skills',
  title: 'Soft Skills',
  tooltip: {
    content: 'All soft skills'
  },
  children: [selfSkill, stressSkill, teamworkSkill]
};

export default function EmpSkillTree () {
  return (
    <SkillProvider>
      <SkillTreeGroup theme={{
        headingFontSize: '30px',
        nodeDesktopFontSize: '8px',
        nodeMobileFontSize: '8px'
      }}>
        {
          ({ skillCount }) => (
            <SkillTree
              treeId='soft-skill'
              title='Soft Skill Tree'
              data={[softSkill]}
              collapsible
              description='Skill tree of soft skills required for effectiveness in the workforce'
              //savedData
              //handleSave
              //handleNodeSelect
            />
          )
        }
      </SkillTreeGroup>
    </SkillProvider>
  );

};