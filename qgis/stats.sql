SELECT
  geometry,
  fid as region_id,
  COUNT(case nat_2005 when 1 then 1 else null end) as count_2005,
  COUNT(case status_2035 when 0 then 1 else null end) as count_2035_decolonized,
  COUNT(case status_2035 when 1 then 1 else null end) as count_2035_stable,
  COUNT(case status_2035 when 2 then 1 else null end) as count_2035_suitable,
  COUNT(case status_2065 when 0 then 1 else null end) as count_2065_decolonized,
  COUNT(case status_2065 when 1 then 1 else null end) as count_2065_stable,
  COUNT(case status_2065 when 2 then 1 else null end) as count_2065_suitable,
  COUNT(case status_2095 when 0 then 1 else null end) as count_2095_decolonized,
  COUNT(case status_2095 when 1 then 1 else null end) as count_2095_stable,
  COUNT(case status_2095 when 2 then 1 else null end) as count_2095_suitable
  from 'input1'
  group by fid
  
UNION

SELECT
  geometry,
  fid_2 as region_id,
    COUNT(case nat_2005 when 1 then 1 else null end) as count_2005,
  COUNT(case status_2035 when 0 then 1 else null end) as count_2035_decolonized,
  COUNT(case status_2035 when 1 then 1 else null end) as count_2035_stable,
  COUNT(case status_2035 when 2 then 1 else null end) as count_2035_suitable,
  COUNT(case status_2065 when 0 then 1 else null end) as count_2065_decolonized,
  COUNT(case status_2065 when 1 then 1 else null end) as count_2065_stable,
  COUNT(case status_2065 when 2 then 1 else null end) as count_2065_suitable,
  COUNT(case status_2095 when 0 then 1 else null end) as count_2095_decolonized,
  COUNT(case status_2095 when 1 then 1 else null end) as count_2095_stable,
  COUNT(case status_2095 when 2 then 1 else null end) as count_2095_suitable
  from 'input1'
  WHERE fid_2 not null
  group by fid_2