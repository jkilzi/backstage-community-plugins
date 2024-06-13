import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

/**
 * The Resource Optimization icon.
 *
 * @public
 */
export const ResourceOptimizationIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        d="m25.87396,11.24127c-1.74451-1.54846-3.92194-2.46057-6.24896-2.59772v7.81494c.26068.06427.50433.16791.72803.30371l5.52094-5.52094Z"
      />
      <circle cx="19" cy="19" r="1.375" />
      <path
        d="m28,1H10C5.02942,1,1,5.02942,1,10v18c0,4.97052,4.02942,9,9,9h18c4.97058,0,9-4.02948,9-9V10c0-4.97058-4.02942-9-9-9Zm-9.625,15.4585v-8.4585c0-.34473.28027-.625.625-.625,3.10327,0,6.021,1.20813,8.21704,3.40186.0011.00104.00256.00134.00366.00244.08386.08423.12811.18842.15411.29639.03082.12671.03223.25928-.01727.38116-.0304.07544-.07599.14612-.13684.20721l-5.98291,5.98291c.24066.39648.38721.85638.38721,1.35303,0,1.44727-1.17773,2.625-2.625,2.625s-2.625-1.17773-2.625-2.625c0-1.23083.85498-2.25922,2-2.5415Zm.625,7.9165c2.96387,0,5.375-2.41113,5.375-5.375,0-.61621-.10254-1.21875-.30566-1.79102-.11523-.3252.05469-.68262.37988-.79785.32617-.11523.68164.05469.79785.37988.25098.70703.37793,1.4502.37793,2.20898,0,3.65332-2.97168,6.625-6.625,6.625s-6.625-2.97168-6.625-6.625c0-2.3584,1.26953-4.55762,3.3125-5.73828.29883-.17285.67969-.07031.85352.22852.17285.29883.07031.68066-.22852.85352-1.65723.95898-2.6875,2.74316-2.6875,4.65625,0,2.96387,2.41113,5.375,5.375,5.375Zm0,5.25c-5.8584,0-10.625-4.7666-10.625-10.625,0-4.66699,2.98926-8.74121,7.4375-10.13867.33203-.10352.68066.08008.78418.40918s-.08008.68066-.40918.78418c-3.92578,1.23242-6.5625,4.82715-6.5625,8.94531,0,5.16895,4.20605,9.375,9.375,9.375s9.375-4.20605,9.375-9.375c0-1.64746-.43359-3.26855-1.25391-4.6875-.17285-.29883-.07031-.68066.22852-.85352.29688-.17285.68066-.07129.85352.22852.93066,1.6084,1.42188,3.44531,1.42188,5.3125,0,5.8584-4.7666,10.625-10.625,10.625Z"
      />
    </SvgIcon>
  );
};