
/* 10 Movie recommendations you have not yet watched (based on playlog_live) 
*  based on most popular tags of movies you've already watched */
SELECT DISTINCT a.artifactid, a.title, a.majtype 
FROM artifacts a 
JOIN t2a t ON a.artifactid = t.artifactid 
WHERE t.artifactid IN ( 
    /* List of artifactid values with same tag as popular list */ 
    SELECT z.artifactid FROM t2a z  WHERE z.tag IN ( 
        /* List of tags popular with this user */ 
        SELECT w.tag FROM (
            SELECT t.tag, COUNT(l.reqtime) as 'plays'  
            FROM playlog_live l  
            JOIN artifacts a ON l.artifactid = a.artifactid  
            JOIN t2a t on l.artifactid = t.artifactid 
            WHERE l.clientid = 'thisIsAFakeId-Netscape-1675678310395' /* A VARIABLE PASSED IN?! */   
            AND a.majtype = 'movie'  
            GROUP BY t.tag 
            ORDER BY 2 DESC 
            LIMIT 5 /* A VARIABLE PASSED IN?! */ 
            ) w 
        )  
    AND z.artifactid NOT IN ( 
        /* List of artifact id values this user has seen */ 
        SELECT artifactid 
        FROM playlog_live 
        WHERE clientid = 'thisIsAFakeId-Netscape-1675678310395' /* A VARIABLE PASSED IN?! */ 
        )
)
AND a.majtype = 'movie'
ORDER BY a.artifactid
LIMIT 10; /* A VARIABLE PASSED IN?! */ 





/* 10 TV Series recommendations you have not yet watched (based on playlog_live) 
*  based on most popular tags of movies you've already watched */
SELECT DISTINCT a.artifactid, a.title, a.majtype 
FROM artifacts a 
JOIN t2a t ON a.artifactid = t.artifactid 
WHERE t.artifactid IN ( 
    /* List of artifactid values with same tag as popular list */ 
    SELECT z.artifactid FROM t2a z  WHERE z.tag IN ( 
        /* List of tags popular with this user */ 
        SELECT w.tag FROM (
            SELECT t.tag, COUNT(l.reqtime) as 'plays'  
            /* SELECT w.title, COUNT(l.reqtime) as 'plays' */ 
            FROM playlog_live l  
            JOIN artifacts a ON l.artifactid = a.artifactid  
            JOIN s2e e ON a.artifactid = e.episodeaid 
            JOIN artifacts w ON e.seriesaid = w.artifactid
            JOIN t2a t on w.artifactid = t.artifactid 
            WHERE l.clientid = 'thisIsAFakeId-Netscape-1675678310395' /* A VARIABLE PASSED IN?! */   
            AND a.majtype = 'tvepisode'  
            /* AND t.tag != 'new' */ 
            GROUP BY 1 
            ORDER BY 2 DESC 
            LIMIT 5 /* A VARIABLE PASSED IN?! */ 
            ) w 
        )  
    AND z.artifactid NOT IN ( 
        /* List of artifact id values this user has seen */ 
        SELECT DISTINCT x.seriesaid 
        FROM playlog_live l
        JOIN s2e x ON l.artifactid = x.episodeaid
        WHERE l.clientid = 'thisIsAFakeId-Netscape-1675678310395' /* A VARIABLE PASSED IN?! */ 
        )
)
AND a.majtype = 'tvseries'
ORDER BY a.artifactid
LIMIT 10; /* A VARIABLE PASSED IN?! */ 







/* TV Series watched by this user */
SELECT t.tag, COUNT(l.reqtime) as 'plays'  
/* SELECT z.title, COUNT(l.reqtime) as 'plays' */ 
FROM playlog_live l  
JOIN artifacts a ON l.artifactid = a.artifactid  
JOIN s2e e ON a.artifactid = e.episodeaid 
JOIN artifacts z ON e.seriesaid = z.artifactid
JOIN t2a t on z.artifactid = t.artifactid 
WHERE l.clientid = 'thisIsAFakeId-Netscape-1675678310395' /* A VARIABLE PASSED IN?! */   
AND a.majtype = 'tvepisode'  
/* AND t.tag != 'new' */ 
GROUP BY 1 
ORDER BY 2 DESC 
LIMIT 5 /* A VARIABLE PASSED IN?! */ 




/*  Movies and TV Series matching tags of things you've already watched  */

/* 10 Movie recommendations you have not yet watched (based on playlog_live) 
*  based on most popular tags of movies you've already watched 
*  PLUS
*  10 TV Series recommendations you have not yet watched (based on playlog_live) 
*  based on most popular tags of movies you've already watched */ 

( 
    SELECT DISTINCT a.artifactid, a.title, a.majtype, a.imdbid 
    FROM artifacts a 
    JOIN t2a t ON a.artifactid = t.artifactid 
    WHERE t.artifactid IN ( 
        /* List of artifactid values with same tag as popular list */ 
        SELECT z.artifactid FROM t2a z  WHERE z.tag IN ( 
            /* List of tags popular with this user */ 
            SELECT w.tag FROM (
                SELECT t.tag, COUNT(l.reqtime) as 'plays'  
                FROM playlog_live l  
                JOIN artifacts a ON l.artifactid = a.artifactid  
                JOIN t2a t on l.artifactid = t.artifactid 
                WHERE l.clientid = 'thisIsAFakeId-Netscape-1675678310395' /* A VARIABLE PASSED IN?! */   
                AND l.reqtime > '2001-09-11 08:35:00'   /* A VARIABLE PASSED IN?! */   
                AND a.majtype = 'movie'  
                GROUP BY t.tag 
                ORDER BY 2 DESC 
                LIMIT 5 /* A VARIABLE PASSED IN?! */ 
                ) w 
            )  
        AND z.artifactid NOT IN ( 
            /* List of artifact id values this user has seen */ 
            SELECT artifactid 
            FROM playlog_live 
            WHERE clientid = 'thisIsAFakeId-Netscape-1675678310395' /* A VARIABLE PASSED IN?! */ 
            )
    )
    AND a.majtype = 'movie'
    ORDER BY a.artifactid
    LIMIT 10 /* A VARIABLE PASSED IN?! */ 
    )  
UNION ALL 
( 
    SELECT DISTINCT b.artifactid, b.title, b.majtype, b.imdbid 
    FROM artifacts b 
    JOIN t2a u ON b.artifactid = u.artifactid 
    WHERE u.artifactid IN ( 
        /* List of artifactid values with same tag as popular list */ 
        SELECT z.artifactid FROM t2a z  WHERE z.tag IN ( 
            /* List of tags popular with this user */ 
            SELECT r.tag FROM (
                SELECT y.tag, COUNT(m.reqtime) as 'plays'  
                /* SELECT w.title, COUNT(l.reqtime) as 'plays' */ 
                FROM playlog_live m  
                JOIN artifacts c ON m.artifactid = c.artifactid  
                JOIN s2e e ON c.artifactid = e.episodeaid 
                JOIN artifacts w ON e.seriesaid = w.artifactid
                JOIN t2a y on w.artifactid = y.artifactid 
                WHERE m.clientid = 'thisIsAFakeId-Netscape-1675678310395' /* A VARIABLE PASSED IN?! */  
                AND m.reqtime > '2001-09-11 08:35:00'   /* A VARIABLE PASSED IN?! */   
                AND c.majtype = 'tvepisode'  
                /* AND t.tag != 'new' */ 
                GROUP BY 1 
                ORDER BY 2 DESC 
                LIMIT 5 /* A VARIABLE PASSED IN?! */ 
                ) r 
            )  
        AND z.artifactid NOT IN ( 
            /* List of artifact id values this user has seen */ 
            SELECT DISTINCT x.seriesaid 
            FROM playlog_live l
            JOIN s2e x ON l.artifactid = x.episodeaid
            WHERE l.clientid = 'thisIsAFakeId-Netscape-1675678310395' /* A VARIABLE PASSED IN?! */ 
            ) 
    ) 
    AND b.majtype = 'tvseries'
    ORDER BY b.artifactid 
    LIMIT 10 /* A VARIABLE PASSED IN?! */ 
    ) 
ORDER BY 2







-- /*  Other titles involving Persons involved in stuff you've watched  */

-- /* 10 Movie recommendations you have not yet watched (based on playlog_live) 
-- *  based on most popular people involved in previously wathed artifacts */
-- SELECT DISTINCT a.artifactid, a.title, a.majtype 
-- FROM artifacts a 
-- JOIN t2a t ON a.artifactid = t.artifactid 
-- WHERE t.artifactid IN ( 
    -- /* List of artifactid values with same tag as popular list */ 
    -- SELECT z.artifactid FROM p2a z  WHERE z.personname IN ( 
        -- /* List of tags popular with this user */ 
        -- SELECT w.personname FROM (
            -- SELECT t.personname, COUNT(l.reqtime) as 'plays'  
            -- FROM playlog_live l  
            -- JOIN artifacts a ON l.artifactid = a.artifactid  
            -- JOIN p2a t on l.artifactid = t.artifactid 
            -- WHERE l.clientid = 'thisIsAFakeId-Netscape-1675678310395' /* A VARIABLE PASSED IN?! */   
            -- /* AND t.artifield = 'director' */
            -- AND a.majtype = 'movie'  
            -- GROUP BY t.personname 
            -- ORDER BY 2 DESC 
            -- LIMIT 20 /* A VARIABLE PASSED IN?! */ 
            -- ) w 
        -- )  
    -- AND z.artifactid NOT IN ( 
        -- /* List of artifact id values this user has seen */ 
        -- SELECT artifactid 
        -- FROM playlog_live 
        -- WHERE clientid = 'thisIsAFakeId-Netscape-1675678310395' /* A VARIABLE PASSED IN?! */ 
        -- )
-- )
-- AND a.majtype = 'movie'
-- ORDER BY a.artifactid
-- LIMIT 20; /* A VARIABLE PASSED IN?! */ 




/*
    What Others are Watching
    
    Lists the 10 most popular Movies and TV Series others 
    are watching and you're not

*/
(
    SELECT DISTINCT a.artifactid, a.title, a.majtype, a.imdbid, COUNT(l.reqtime) 
    FROM playlog_live l 
    JOIN artifacts a ON l.artifactid = a.artifactid
    WHERE a.majtype = "movie" 
    AND l.artifactid NOT IN (
        SELECT artifactid 
        FROM playlog_live 
        WHERE clientid = 'thisIsAFakeId-Netscape-1675678310395' 
        )
    AND l.clientid != 'thisIsAFakeId-Netscape-1675678310395' /* A VARIABLE PASSED IN?! */  
    AND l.reqtime > '2001-09-11 08:35:00'   /* A VARIABLE PASSED IN?! */  
    GROUP BY 1
    ORDER BY 5 DESC
    LIMIT 10
    )
UNION ALL
(
    SELECT DISTINCT a.artifactid, a.title, a.majtype, a.imdbid, COUNT(l.reqtime) 
    FROM playlog_live l 
    JOIN s2e e ON l.artifactid = e.episodeaid 
    JOIN artifacts a ON e.seriesaid = a.artifactid
    WHERE a.majtype = "tvseries" 
    AND l.artifactid NOT IN (SELECT artifactid FROM playlog_live WHERE clientid = 'thisIsAFakeId-Netscape-1675678310395' )
    AND l.clientid != 'thisIsAFakeId-Netscape-1675678310395' /* A VARIABLE PASSED IN?! */  
    AND l.reqtime > '2001-09-11 08:35:00'   /* A VARIABLE PASSED IN?! */  
    GROUP BY 1
    ORDER BY 5 DESC
    LIMIT 10
)
ORDER BY 1








-- /*  Other titles involving Persons involved in stuff you've watched  */

-- /* 10 Movie recommendations you have not yet watched (based on playlog_live) 
-- *  based on most popular people involved in previously wathed artifacts */
-- (
    -- SELECT DISTINCT a.artifactid, a.title, a.majtype, a.imdbid 
    -- FROM artifacts a 
    -- JOIN t2a t ON a.artifactid = t.artifactid 
    -- WHERE t.artifactid IN ( 
        -- /* List of artifactid values with same tag as popular list */ 
        -- SELECT z.artifactid FROM p2a z  WHERE z.personname IN ( 
            -- /* List of tags popular with this user */ 
            -- SELECT w.personname FROM (
                -- SELECT t.personname, COUNT(l.reqtime) as 'plays'  
                -- FROM playlog_live l  
                -- JOIN artifacts a ON l.artifactid = a.artifactid  
                -- JOIN p2a t on l.artifactid = t.artifactid 
                -- WHERE l.clientid = 'thisIsAFakeId-Netscape-1675678310395' /* A VARIABLE PASSED IN?! */   
                -- /* AND t.artifield = 'director' */
                -- AND a.majtype = 'movie'  
                -- GROUP BY t.personname 
                -- ORDER BY 2 DESC 
                -- LIMIT 20 /* A VARIABLE PASSED IN?! */ 
                -- ) w 
            -- )  
        -- AND z.artifactid NOT IN ( 
            -- /* List of artifact id values this user has seen */ 
            -- SELECT artifactid 
            -- FROM playlog_live 
            -- WHERE clientid = 'thisIsAFakeId-Netscape-1675678310395' /* A VARIABLE PASSED IN?! */ 
            -- )
    -- )
    -- AND a.majtype = 'movie'
    -- ORDER BY a.artifactid
    -- LIMIT 20 /* A VARIABLE PASSED IN?! */ 
    -- )
-- UNION ALL 
-- (
    -- SELECT DISTINCT b.artifactid, b.title, b.majtype, b.imdbid 
    -- FROM artifacts b 
    -- -- JOIN t2a u ON b.artifactid = u.artifactid 
    -- WHERE a.artifactid IN ( 
        -- /* List of artifactid values with same tag as popular list */ 
        -- SELECT DISTINCT z.artifactid 
        -- FROM p2a z  
        -- WHERE z.personname IN ( 
            -- /* List of tags popular with this user */ 
            -- SELECT w.personname 
            -- FROM (
                -- SELECT t.personname, COUNT(l.reqtime) as 'plays'  
                -- FROM playlog_live l  
                -- JOIN s2e e ON l.artifactid = e.episodeaid 
                -- JOIN artifacts a ON e.seriesaid = a.artifactid  
                -- JOIN p2a t on t.artifactid = e.seriesaid 
                -- WHERE l.clientid = 'thisIsAFakeId-Netscape-1675678310395' 
                -- AND a.majtype = 'tvseries'  
                -- AND t.personname != "string" 
                -- GROUP BY t.personname 
                -- ORDER BY 2 DESC 
                -- LIMIT 20                
                -- ) w 
            -- )  
        -- AND z.artifactid NOT IN ( 
            -- /* List of artifact id values this user has seen */ 
            -- SELECT DISTINCT x.seriesaid 
            -- FROM playlog_live l
            -- JOIN s2e x ON l.artifactid = x.episodeaid
            -- WHERE l.clientid = 'thisIsAFakeId-Netscape-1675678310395' /* A VARIABLE PASSED IN?! */ 
            -- ) 
        -- ) 
    -- AND b.majtype = 'tvseries'
    -- ORDER BY b.artifactid 
    -- LIMIT 10 /* A VARIABLE PASSED IN?! */ 
    -- )
-- ORDER BY 1
    




-- SELECT DISTINCT a.artifactid, a.title 
-- FROM p2a p 
-- JOIN s2e e ON p.artifactid = e.episodeaid
-- JOIN artifacts a ON e.seriesaid = a.artifactid 
-- -- WHERE personname IN ('William Link','Peter Falk','Mike Lally','John Finnegan','Richard Levinson');

-- -- WHERE p.personname IN ("William Link", "Peter Falk", "Mike Lally", "John Finnegan", "Richard Levinson", "Neil deGrasse Tyson", "David Suchet", "Philip Jackson", "Agatha Christie", "Pauline Moran", "Clive Exton", "Hugh Fraser", "James Spader", "Megan Boone", "Diego Klattenhoff", "Jon Bokenkamp", "Ringo Starr", "George Harrison", "Paul McCartney", "Peter Jackson") 

-- WHERE p.personname IN ("Megan Boone", "Diego Klattenhoff", "James Spader", "Jon Bokenkamp", "Mike Rowe", "Matt Berry", "Richard Ayoade", "Matthew Holness", "Patrick Stewart", "Marina Sirtis", "LeVar Burton", "Gates McFadden", "Jonathan Frakes", "Michael Dorn", "Brent Spiner", "Wil Wheaton", "Denise Crosby", "Jack Soo", "Steve Landesberg", "Abe Vigoda", "Gregory Sierra", "James Gregory", "Hal Linden", "Ron Glass", "Max Gail", "Ron Carey", "Barbara Barrie", "Peter Jackson", "George Harrison", "Ringo Starr")

-- -- WHERE p.personname IN (
    -- -- SELECT w.personname 
    -- -- FROM (
        -- -- SELECT t.personname, COUNT(l.reqtime) as 'plays'  
        -- -- FROM playlog_live l  
        -- -- JOIN s2e e ON l.artifactid = e.episodeaid 
        -- -- JOIN artifacts a ON e.seriesaid = a.artifactid  
        -- -- JOIN p2a t on t.artifactid = e.seriesaid 
        -- -- WHERE l.clientid = 'thisIsAFakeId-Netscape-1675678310395' 
        -- -- AND (a.majtype = 'tvseries' OR a.majtype = 'tvepisode')  
        -- -- AND t.personname != "string" 
        -- -- GROUP BY t.personname 
        -- -- ORDER BY 2 DESC 
        -- -- LIMIT 30                
        -- -- ) w 
    -- -- ) 
-- ORDER BY 1
-- LIMIT 40

-- SELECT DISTINCT u.artifactid, /* u.personname, */ u.title
-- FROM (
    -- (
        -- SELECT DISTINCT n.artifactid, m.personname, n.title, n.majtype
        -- FROM (
            -- SELECT a.artifactid, p.personname, p.artifield, a.title, a.majtype
            -- FROM p2a p 
            -- JOIN artifacts a ON p.artifactid = a.artifactid
            -- WHERE p.personname in ("Megan Boone", "Diego Klattenhoff", "James Spader", "Jon Bokenkamp", "Mike Rowe", "Matt Berry", "Richard Ayoade", "Matthew Holness", "Patrick Stewart", "Marina Sirtis", "LeVar Burton", "Gates McFadden", "Jonathan Frakes", "Michael Dorn", "Brent Spiner", "Wil Wheaton", "Denise Crosby", "Jack Soo", "Steve Landesberg", "Abe Vigoda", "Gregory Sierra", "James Gregory", "Hal Linden", "Ron Glass", "Max Gail", "Ron Carey", "Barbara Barrie", "Peter Jackson", "George Harrison", "Ringo Starr") 
            -- -- WHERE p.personname in (
                -- -- SELECT w.personname 
                -- -- FROM (
                    -- -- SELECT t.personname, COUNT(l.reqtime) as 'plays', MIN(l.reqtime) as "firstplay", MAX(l.reqtime) as "lastplay"  
                    -- -- FROM playlog_live l  
                    -- -- JOIN s2e e ON l.artifactid = e.episodeaid 
                    -- -- JOIN artifacts a ON e.seriesaid = a.artifactid  
                    -- -- JOIN p2a t on t.artifactid = e.seriesaid 
                    -- -- WHERE l.clientid = 'thisIsAFakeId-Netscape-1675678310395' 
                    -- -- -- AND l.reqtime > '2001-09-11 08:35:00'
                    -- -- AND l.reqtime > '2023-02-01 00:00:00'
                    -- -- AND (a.majtype = 'tvseries' OR a.majtype = 'tvepisode')
                    -- -- -- AND a.majtype = 'movie' 
                    -- -- -- AND a.majtype = 'tvseries' 
                    -- -- AND t.personname != "string" 
                    -- -- GROUP BY t.personname 
                    -- -- -- ORDER BY 2 DESC 
                    -- -- ORDER BY 3 DESC
                    -- -- LIMIT 30                
                    -- -- ) w             
            -- -- )
            -- AND a.majtype = 'tvepisode' 
            -- ) m
        -- JOIN s2e s ON m.artifactid = s.episodeaid
        -- JOIN artifacts n ON s.seriesaid = n.artifactid
        -- )
    -- UNION ALL
    -- (
        -- SELECT a.artifactid, p.personname, a.title, a.majtype
        -- FROM p2a p 
        -- JOIN artifacts a ON p.artifactid = a.artifactid
        -- WHERE p.personname in ("Megan Boone", "Diego Klattenhoff", "James Spader", "Jon Bokenkamp", "Mike Rowe", "Matt Berry", "Richard Ayoade", "Matthew Holness", "Patrick Stewart", "Marina Sirtis", "LeVar Burton", "Gates McFadden", "Jonathan Frakes", "Michael Dorn", "Brent Spiner", "Wil Wheaton", "Denise Crosby", "Jack Soo", "Steve Landesberg", "Abe Vigoda", "Gregory Sierra", "James Gregory", "Hal Linden", "Ron Glass", "Max Gail", "Ron Carey", "Barbara Barrie", "Peter Jackson", "George Harrison", "Ringo Starr") 
        -- -- WHERE p.personname in (
            -- -- SELECT w.personname 
            -- -- FROM (
                -- -- SELECT t.personname, COUNT(l.reqtime) as 'plays', MIN(l.reqtime) as "firstplay", MAX(l.reqtime) as "lastplay"  
                -- -- FROM playlog_live l  
                -- -- JOIN s2e e ON l.artifactid = e.episodeaid 
                -- -- JOIN artifacts a ON e.seriesaid = a.artifactid  
                -- -- JOIN p2a t on t.artifactid = e.seriesaid 
                -- -- WHERE l.clientid = 'thisIsAFakeId-Netscape-1675678310395' 
                -- -- -- AND l.reqtime > '2001-09-11 08:35:00'
                -- -- AND l.reqtime > '2023-02-01 00:00:00'
                -- -- AND (a.majtype = 'tvseries' OR a.majtype = 'tvepisode')
                -- -- -- AND a.majtype = 'movie' 
                -- -- -- AND a.majtype = 'tvseries' 
                -- -- AND t.personname != "string" 
                -- -- GROUP BY t.personname 
                -- -- -- ORDER BY 2 DESC 
                -- -- ORDER BY 3 DESC
                -- -- LIMIT 30                
                -- -- ) w         
        -- -- )
        -- AND a.majtype = 'tvseries' 
        -- )
    -- ) u
-- ORDER BY 2
    



    -- SELECT w.personname 
    -- FROM (
        -- SELECT t.personname, COUNT(l.reqtime) as 'plays', MIN(l.reqtime) as "firstplay", MAX(l.reqtime) as "lastplay"  
        -- FROM playlog_live l  
        -- JOIN s2e e ON l.artifactid = e.episodeaid 
        -- JOIN artifacts a ON e.seriesaid = a.artifactid  
        -- JOIN p2a t on t.artifactid = e.seriesaid 
        -- WHERE l.clientid = 'thisIsAFakeId-Netscape-1675678310395' 
        -- -- AND l.reqtime > '2001-09-11 08:35:00'
        -- AND l.reqtime > '2023-02-01 00:00:00'
        -- AND (a.majtype = 'tvseries' OR a.majtype = 'tvepisode')
        -- -- AND a.majtype = 'movie' 
        -- -- AND a.majtype = 'tvseries' 
        -- AND t.personname != "string" 
        -- GROUP BY t.personname 
        -- -- ORDER BY 2 DESC 
        -- ORDER BY 3 DESC
        -- LIMIT 100                
        -- ) w 
        

-- SELECT DISTINCT artifactid 
-- FROM playlog_live 
-- WHERE clientid = 'thisIsAFakeId-Netscape-1675678310395' 
-- AND reqtime >= '2023-02-01 00:00:00'


-- SELECT DISTINCT u.artifactid, /* u.personname, */ u.title
-- FROM (
    -- (
        -- SELECT DISTINCT n.artifactid, m.personname, n.title, n.majtype
        -- FROM (
            -- SELECT a.artifactid, p.personname, p.artifield, a.title, a.majtype
            -- FROM p2a p 
            -- JOIN artifacts a ON p.artifactid = a.artifactid
            -- WHERE p.personname in ("Megan Boone", "Diego Klattenhoff", "James Spader", "Jon Bokenkamp", "Mike Rowe", "Matt Berry", "Richard Ayoade", "Matthew Holness", "Patrick Stewart", "Marina Sirtis", "LeVar Burton", "Gates McFadden", "Jonathan Frakes", "Michael Dorn", "Brent Spiner", "Wil Wheaton", "Denise Crosby", "Jack Soo", "Steve Landesberg", "Abe Vigoda", "Gregory Sierra", "James Gregory", "Hal Linden", "Ron Glass", "Max Gail", "Ron Carey", "Barbara Barrie", "Peter Jackson", "George Harrison", "Ringo Starr") 
            -- AND a.majtype = 'tvepisode' 
            -- ) m
        -- JOIN s2e s ON m.artifactid = s.episodeaid
        -- JOIN artifacts n ON s.seriesaid = n.artifactid
        -- )
    -- UNION ALL
    -- (
        -- SELECT a.artifactid, p.personname, a.title, a.majtype
        -- FROM p2a p 
        -- JOIN artifacts a ON p.artifactid = a.artifactid
        -- WHERE p.personname in ("Megan Boone", "Diego Klattenhoff", "James Spader", "Jon Bokenkamp", "Mike Rowe", "Matt Berry", "Richard Ayoade", "Matthew Holness", "Patrick Stewart", "Marina Sirtis", "LeVar Burton", "Gates McFadden", "Jonathan Frakes", "Michael Dorn", "Brent Spiner", "Wil Wheaton", "Denise Crosby", "Jack Soo", "Steve Landesberg", "Abe Vigoda", "Gregory Sierra", "James Gregory", "Hal Linden", "Ron Glass", "Max Gail", "Ron Carey", "Barbara Barrie", "Peter Jackson", "George Harrison", "Ringo Starr") 
        -- AND a.majtype = 'tvseries' 
        -- )
    -- ) u
-- ORDER BY 2
    



SELECT DISTINCT a.artifactid, d.title, d.majtype
FROM p2a a 
JOIN artifacts d ON d.artifactid = a.artifactid
WHERE a.personname in (
    SELECT DISTINCT b.personname 
    FROM p2a b 
    WHERE b.personname != 'string' 
    AND b.artifactid in ( 
        SELECT c.artifactid 
        FROM playlog_live c 
        WHERE  c.clientid  = 'thisIsAFakeId-Netscape-1675678310395' 
        -- LIMIT 10
        )
    -- LIMIT 10
    )
AND d.majtype = 'tvseries'
AND a.artifactid NOT IN ( SELECT e.artifactid 
    FROM playlog_live e 
    WHERE  e.clientid  = 'thisIsAFakeId-Netscape-1675678310395' 
    )
LIMIT 10;



SELECT DISTINCT f.artifactid, f.title 
FROM artifacts f  
JOIN s2e g ON f.artifactid = g.seriesaid 
JOIN playlog_live h ON g.episodeaid = h.artifactid 
WHERE h.clientid  = 'thisIsAFakeId-Netscape-1675678310395' 
AND h.reqtime >= '2023-02-01 00:00:00'
LIMIT 20;


-- SELECT DISTINCT q.artifactid, r.title, r.majtype 
-- FROM p2a q 
-- JOIN artifacts r ON q.artifactid = r.artifactid 
-- WHERE q.personname IN (
    -- SELECT DISTINCT p.personname
    -- FROM (
        -- (
            -- SELECT DISTINCT n.personname
            -- FROM playlog_live l  
            -- JOIN artifacts m ON l.artifactid = m.artifactid 
            -- JOIN p2a n ON l.artifactid = n.artifactid 
            -- WHERE l.clientid  = 'thisIsAFakeId-Netscape-1675678310395' 
            -- AND l.reqtime >= '2023-05-01 00:00:00'
            -- AND m.majtype = 'tvepisode'
            -- AND n.personname != "string"
            -- -- LIMIT 20
            -- )
        -- UNION ALL
        -- (
            -- SELECT DISTINCT n.personname
            -- FROM playlog_live l  
            -- JOIN s2e o ON l.artifactid = o.episodeaid 
            -- JOIN artifacts m ON o.seriesaid = m.artifactid 
            -- JOIN p2a n ON m.artifactid = n.artifactid 
            -- WHERE l.clientid  = 'thisIsAFakeId-Netscape-1675678310395' 
            -- AND l.reqtime >= '2023-05-01 00:00:00'
            -- AND m.majtype = 'tvseries'
            -- AND n.personname != "string"
            -- -- LIMIT 20
            -- )
        -- UNION ALL
        -- (
            -- SELECT DISTINCT n.personname
            -- FROM playlog_live l  
            -- JOIN artifacts m ON l.artifactid = m.artifactid 
            -- JOIN p2a n ON l.artifactid = n.artifactid 
            -- WHERE l.clientid  = 'thisIsAFakeId-Netscape-1675678310395' 
            -- AND l.reqtime >= '2023-05-01 00:00:00'
            -- AND m.majtype = 'movie'
            -- AND n.personname != "string"
            -- -- LIMIT 20
            -- )
        -- ) p
    -- )
-- AND r.majtype IN ('movie','tvseries')
-- -- AND q.artifactid NOT IN (SELECT s.artifactid FROM playlog_live s WHERE 



SELECT o.artifactid, p.title, p.majtype  
FROM p2a o
JOIN artifacts p ON o.artifactid = p.artifactid
JOIN p2a q ON 
WHERE o.personname IN (
    SELECT DISTINCT n.personname
    FROM playlog_live l  
    -- JOIN artifacts m ON l.artifactid = m.artifactid 
    JOIN p2a n ON l.artifactid = n.artifactid 
    WHERE l.clientid  = 'thisIsAFakeId-Netscape-1675678310395' 
    AND l.reqtime >= '2023-05-01 00:00:00'
    -- AND m.majtype = 'movie'
    AND n.personname != "string"
    ) 










-- (
    -- SELECT d.artifactid, d.title, d.majtype
    -- FROM playlog_live a
    -- JOIN p2a b ON a.artifactid = b.artifactid 
    -- JOIN p2a c ON b.personname = c.personname
    -- JOIN artifacts d ON c.artifactid = d.artifactid 
    -- WHERE a.clientid  = 'thisIsAFakeId-Netscape-1675678310395' 
    -- AND a.reqtime >= '2023-05-01 00:00:00' 
    -- AND b.personname != "string"
    -- AND d.majtype IN ('movie','tvseries')
    -- ) 
-- UNION DISTINCT
-- (
    -- SELECT e.artifactid, e.title, e.majtype
    -- FROM playlog_live a
    -- JOIN p2a b ON a.artifactid = b.artifactid 
    -- JOIN p2a c ON b.personname = c.personname
    -- JOIN s2e d ON c.artifactid = d.episodeaid
    -- JOIN artifacts e ON d.seriesaid = e.artifactid 
    -- WHERE a.clientid  = 'thisIsAFakeId-Netscape-1675678310395' 
    -- AND a.reqtime >= '2023-05-01 00:00:00' 
    -- AND b.personname != "string"
    -- AND e.majtype = 'tvseries'
    -- )
    

/* THIS is how you do recommendations by people involved */

-- Get the list of people involved
SELECT  DISTINCT b.personname 
FROM playlog_live a
JOIN p2a b ON a.artifactid = b.artifactid 
WHERE a.clientid  = 'thisIsAFakeId-Netscape-1675678310395' 
AND a.reqtime >= '2023-02-01 00:00:00' 
AND b.personname != "string" 
INTO OUTFILE '/tmp/artifactpersons.txt' 

("Adam Nagaitis", "Adrian Rawlins", "Con O'Neill", "Craig Mazin", "Diego Klattenhoff", "Emily Watson", "Gareth Gwenlan", "Graham Crowden", "J.R. Orci", "James Spader", "Janine Duvitski", "Jared Harris", "Jason George", "Jessie Buckley", "Joe Carnahan", "Johan Renck", "Jon Bokenkamp", "Lukas Reiter", "Megan Boone", "Michael Aitkens", "Michael W. Watkins", "Paul Ritter", "Robert Emms", "Sam Troughton", "Stellan Skarsgard", "Stephanie Cole")
("Abe Vigoda", "Adam Nagaitis", "Adrian Rawlins", "Alan Bean", "Bruce Bilson", "Buzz Aldrin", "Charles Duke", "Charlie Duke", "Chris Hayward", "Con O'Neill", "Craig Mazin", "Daniel Kwan", "Daniel Scheinert", "Danny Arnold", "David Scott", "David Sington", "Diego Klattenhoff", "Edgar Mitchell", "Emily Watson", "Eugene Cernan", "Gareth Gwenlan", "Gene Cernan", "Graham Crowden", "Gregory Schwartz", "Gwyn Williams", "Hal Linden", "Harrison Schmitt", "Harry Shum Jr.", "J.R. Orci", "James Hong", "James Spader", "Jamie Lee Curtis", "Janine Duvitski", "Jared Harris", "Jason George", "Jeffrey Roth", "Jenny Slate", "Jessie Buckley", "Jim Lovell", "Joe Carnahan", "Johan Renck", "John Young", "Jon Bokenkamp", "Ke Huy Quan", "Lee Bernhardi", "Lukas Reiter", "Max Gail", "Megan Boone", "Michael Aitkens", "Michael Collins", "Michael W. Watkins", "Michelle Yeoh", "Noam Pitlik", "Paul M. Basta", "Paul Ritter", "Reinhold Weege", "Robert Emms", "Sam Troughton", "Stellan Skarsgard", "Stephanie Cole", "Stephanie Hsu", "Theodore J. Flicker", "Tom Reeder", "Tony Sheehan")
("Abe Vigoda", "Adam Nagaitis", "Adrian Malone", "Adrian Rawlins", "Akira Kurosawa", "Akiva Goldsman", "Alan Bean", "Alan Davies", "Alan Fudge", "Albert Popwell", "Albert S. Ruddy", "Alec Guinness", "Alex Kurtzman", "Alex Nicol", "Alf Kjellin", "Alfred Molina", "Alma Beltran", "Amanda Row", "Amanda Seyfried", "Andi Armaganian", "Aneta Corsaut", "Anjanette Comer", "Ann Druyan", "Anne Baxter", "Anne Francis", "Anson Mount", "Antoinette Bower", "Arlene Martel", "Arne Sultan", "Arthur Batanides", "Arthur Bostrom", "Arthur Hailey", "Arthur Julian", "Arthur Malet", "Barbara Barrie", "Barbara Baxley", "Barbara Hale", "Barnard Hughes", "Barry Nelson", "Barry Russo", "Ben Gazzara", "Bernard Fein", "Bernard Fox", "Bernard L. Kowalski", "Bill McKinney", "Bill Pope", "Billie Whitelaw", "Blake Edwards", "Bluthe Danner", "Bob Crane", "Bob Dishy", "Bob Schiller", "Bob Weiskopf", "Booker Bradshaw", "Boris Sagal", "Brad Radnitz", "Bradford Dillman", "Brannon Braga", "Bruce Bilson", "Bruce Boxleitner", "Bud Yorkin", "Burr DeBenning", "Burt Kwouk", "Burt Lancaster", "Buzz Aldrin", "Byron Morrow", "Carl Sagan", "Carmen Silvera", "Carrie Fisher", "Carroll O'Connor", "Cary Elwes", "Catherine Schell", "Charles Beaumont", "Charles Bronson", "Charles Crichton", "Charles Duke", "Charles Macaulay", "Charlie Duke", "Chris Fisher", "Chris Hayward", "Christiane Amanpour", "Christopher Emerson", "Christopher J. Byrne", "Christopher Penfold", "Christopher Plummer", "Chuck McCann", "Cindy Morgan", "Cliff Carnell", "Clint Walker", "Colin Blakely", "Con O'Neill", "Craig Mazin", "D. C. Fontana", "D.C. Fontana", "Dan Liu", "Dana Wynter", "Daniel Kwan", "Daniel Scheinert", "Danny Arnold", "Danny DeVito", "Danny Goldman", "Darrell Zwerling", "David Chandler", "David Croft", "David Davis", "David Kerr", "David Mitchell", "David Niven", "David Opatoshu", "David P. Lewis", "David Rayfiel", "David Scheiner", "David Scott", "David Sheiner", "David Sington", "David Warner", "David White", "Dean Hargrove", "Dean Jagger", "Dean Martin", "Dean Stockwell", "Deborah McIntyre", "DeForest Kelley", "Dick Van Dyke", "Diego Klattenhoff", "Don Gordon", "Don Keefer", "Don Knight", "Don Medford", "Donald Sutherland", "E. G. Marshall", "Ed Nelson", "Edgar Mitchell", "Edith Head", "Edward H. Feldman", "Edward M. Abroms", "Eijirō Tōno", "Elanor Zee", "Emily Watson", "Eric Christmas", "Ernest Borgnine", "Ethan Peck", "Eugene Cernan", "Ewa Aulin", "Francis De Sales", "Frank Baxter", "Frank Converse", "Frank Overton", "Frank Waldman", "Fred Beir", "Fred Freeman", "Fred Tatasciore", "Gail Kobe", "Gareth Gwenlan", "Gary Collins", "Gena Rowlands", "Gene Cernan", "Gene Reynolds", "Gene Roddenberry", "Gene Wilder", "Geoffrey Haines-Stiles", "George Grizzard", "George Hamilton", "George Kennedy", "George Lucas", "George Seaton", "George Wyner", "Glenn Steinbaum", "Gorden Kaye", "Graham Crowden", "Gregory Schwartz", "Gregory Sierra", "Gretchen Corbett", "Gwyn Williams", "Hal Linden", "Hannah Long", "Harrison Ford", "Harrison Schmitt", "Harry Shum Jr.", "Harvey Hart", "Harvey Jason", "Hector Elizondo", "Helen Hayes", "Henry Hathaway", "Herbert Lom", "Hideo Oguni", "Honor Blackman", "Howard Berk", "Howard Morris", "Hugh Griffith", "Hy Averback", "Ian Lorimer", "Ida Lupino", "Irene Dailey", "J.R. Orci", "Jack Bender", "Jack Cassidy", "Jack H. Robinson", "Jack Klugman", "Jack MacGowran", "Jack Whitehall", "Jackson Gillis", "Jacqueline Bisset", "Jacques Aubuchon", "James Bachman", "James Burrows", "James Gregory", "James Hong", "James L. Brooks", "James L. Conway", "James McEachin", "James Menzies", "James Olson", "James Sheldon", "James Spader", "James Whitmore", "Jamie Lee Curtis", "Jane Greer", "Janet Leigh", "Janet Street-Porter", "Janine Duvitski", "Janit Baldwin", "Jared Harris", "Jared Martin", "Jaromír Hanzlík", "Jason George", "Jason Robards", "Jean Seberg", "Jean Stapleton", "Jeanette Nolan", "Jeannot Szwarc", "Jeff Bridges", "Jeff Conaway", "Jeffrey Roth", "Jenny Slate", "Jeremy Kagan", "Jeremy Lloyd", "Jess Bush", "Jessica Walter", "Jessie Buckley", "Jim Brown", "Jim Lovell", "JoAnna Cameron", "Joe Carnahan", "Johan Renck", "John Archer", "John B. Hobbs", "John Banner", "John Brahm", "John Calvin", "John Cassavetes", "John Davis Chandler", "John Dehner", "John Finnegan", "John Fraser", "John Huston", "John Law", "John Lennon", "John Lloyd", "John Meredyth Lucas", "John Milford", "John Randolph", "John T. Dugan", "John Williams", "John Young", "John Zaremba", "Johnny Cash", "Johnny Vegas", "Jon Bokenkamp", "Jonathan Frakes", "Jonathan Latimer", "Jonathan Morgan Heit", "Jose Ferrer", "Joseph Cotten", "Josephine Hutchinson", "Joshua Bryant", "Joyce Van Patten", "Judd Hirsch", "Katherine Squire", "Ke Huy Quan", "Ken Hughes", "Kenn Ashe", "Kevin Dart", "Kevin McCarthy", "Keythe Farley", "Kinji Fukasaku", "Kirsten Dunst", "Larry Cedar", "Larry Cohen", "Larry Forrester", "Larry Rhine", "Larry Storch", "Laurence Harvey", "Laurence Marks", "Laurence N. Wolfe", "Lawrence J. Cohen", "Lee Bernhardi", "Lee Marvin", "Lee Montgomery", "Leonard Nimoy", "Leonard Rossiter", "Lesley Ann Warren", "Lesley-Anne Down", "LeVar Burton", "Lew Ayres", "Lloyd Bochner", "Lloyd Nolan", "Lou Shaw", "Lou Wagner", "Louise Latham", "Lucille Merideth", "Lukas Heller", "Lukas Reiter", "Majel Barett", "Maria Frucci", "Mariette Hartley", "Mark Hamill", "Martin Balsam", "Martin Jarvis", "Martin Landau", "Martin Sheen", "Maureen Stapleton", "Maurice Evans", "Maurice Hurley", "Max Gail", "Megan Boone", "Mel Ferrer", "Mel Tolkin", "Michael Aitkens", "Michael Chochol", "Michael Collins", "Michael McGuire", "Michael Pataki", "Michael Sayers", "Michael Strong", "Michael W. Watkins", "Michelle Yeoh", "Mickey Spillane", "Mike Kellin", "Milton Frome", "Myrna Bercovici", "Myrna Loy", "Nadia Rochelle Pfarr", "Natalie Trundy", "Neil deGrasse Tyson", "Nicholas Colasanto", "Nick Sagan", "Nita Talbot", "Noam Pitlik", "Noel Fielding", "Norman Lear", "Nunnally Johnson", "Olivia Colman", "Orson Welles", "Oskar Werner", "Otis Young", "Pat Morita", "Patrick McGoohan", "Patrick Stewart", "Paul Adam", "Paul Bogart", "Paul M. Basta", "Paul McCartney", "Paul Ritter", "Paul Shenar", "Paul Sorvino", "Pedro Armendáriz Jr.", "Peggy Mondo", "Perry Lafferty", "Pert Kelton", "Peter Cushing", "Peter Falk", "Peter Jackson", "Peter S, Fischer", "Peter S. Fischer", "Peter Sellers", "Phil LaMarr", "Phil Sharp", "Phyllis Thaxter", "Pippa Scott", "Rachel Leiterman", "Ralph Meeker", "Ray Bradbury", "Ray Milland", "Reinhold Weege", "Ricardo Montalban", "Richard Basehart", "Richard Caine", "Richard Fleischer", "Richard Jaeckel", "Richard Kiley", "Richard Levinson", "Richard Matheson", "Richard Pearson", "Richard Powell", "Richard Quine", "Richard Stahl", "Rob McCain", "Rob Reiner", "Robert Aldrich", "Robert Butler", "Robert Conrad", "Robert Culp", "Robert Duvall", "Robert Emms", "Robert Karnes", "Robert Middleton", "Robert Ryan", "Robert Vaughn", "Robert Webb", "Robert Webber", "Rod Serling", "Roland Kibbee", "Ronald Long", "Rosemary Murphy", "Ross Martin", "Ryūzō Kikushima", "Sal Mineo", "Sam Troughton", "Sandi Toksvig", "Sandra Smith", "Sara Pascoe", "Sean Morgan", "Seth MacFarlane", "Shirl Hendryx", "Sidney Miller", "Simon Oakland", "So Yamamura", "Sorrell Booke", "Stan Daniels", "Stanley Ralph Ross", "Stellan Skarsgard", "Stephanie Cole", "Stephanie Hsu", "Stephen Fry", "Stephen J. Cannell", "Steven Bochco", "Steven Lisberger", "Steven Soter", "Stuart Rosenberg", "Susan Howard", "Sydney Freeland", "Takahiro Tamura", "Tatsuya Mihashi", "Ted Gehring", "Ted Post", "Telly Savalas", "The Beatles", "Theodore J. Flicker", "Tom Reeder", "Tony Sheehan", "Toshio Masuda", "Trini Lopez", "Ursula Andress", "Val Avery", "Val Guest", "Valerie Harper", "Van Heflin", "Vaughn Taylor", "Vera Miles", "Vern Rowe", "Vicki Michelle", "Victor Campos", "Victor Millan", "Victor Spinetti", "Vito Scotti", "Wallace Rooney", "Walter Grauman", "Werner Klemperer", "Wesley Salter", "Whit Bissell", "Wilfrid Hyde-White", "Will Geer", "William Bryant", "William Driskill", "William F. Claxton", "William Link", "William Marshall", "William Shatner", "William Smith", "Wolf Mankowitz")

-- Then get the list of artifacts involving those people that have not 
-- been watched by this client.

SELECT * FROM 
(
    (
        SELECT d.artifactid, d.title, d.majtype
        FROM  p2a c 
        JOIN artifacts d ON c.artifactid = d.artifactid 
        WHERE c.personname IN ("Abe Vigoda", "Adam Nagaitis", "Adrian Malone", "Adrian Rawlins", "Akira Kurosawa", "Akiva Goldsman", "Alan Bean", "Alan Davies", "Alan Fudge", "Albert Popwell", "Albert S. Ruddy", "Alec Guinness", "Alex Kurtzman", "Alex Nicol", "Alf Kjellin", "Alfred Molina", "Alma Beltran", "Amanda Row", "Amanda Seyfried", "Andi Armaganian", "Aneta Corsaut", "Anjanette Comer", "Ann Druyan", "Anne Baxter", "Anne Francis", "Anson Mount", "Antoinette Bower", "Arlene Martel", "Arne Sultan", "Arthur Batanides", "Arthur Bostrom", "Arthur Hailey", "Arthur Julian", "Arthur Malet", "Barbara Barrie", "Barbara Baxley", "Barbara Hale", "Barnard Hughes", "Barry Nelson", "Barry Russo", "Ben Gazzara", "Bernard Fein", "Bernard Fox", "Bernard L. Kowalski", "Bill McKinney", "Bill Pope", "Billie Whitelaw", "Blake Edwards", "Bluthe Danner", "Bob Crane", "Bob Dishy", "Bob Schiller", "Bob Weiskopf", "Booker Bradshaw", "Boris Sagal", "Brad Radnitz", "Bradford Dillman", "Brannon Braga", "Bruce Bilson", "Bruce Boxleitner", "Bud Yorkin", "Burr DeBenning", "Burt Kwouk", "Burt Lancaster", "Buzz Aldrin", "Byron Morrow", "Carl Sagan", "Carmen Silvera", "Carrie Fisher", "Carroll O'Connor", "Cary Elwes", "Catherine Schell", "Charles Beaumont", "Charles Bronson", "Charles Crichton", "Charles Duke", "Charles Macaulay", "Charlie Duke", "Chris Fisher", "Chris Hayward", "Christiane Amanpour", "Christopher Emerson", "Christopher J. Byrne", "Christopher Penfold", "Christopher Plummer", "Chuck McCann", "Cindy Morgan", "Cliff Carnell", "Clint Walker", "Colin Blakely", "Con O'Neill", "Craig Mazin", "D. C. Fontana", "D.C. Fontana", "Dan Liu", "Dana Wynter", "Daniel Kwan", "Daniel Scheinert", "Danny Arnold", "Danny DeVito", "Danny Goldman", "Darrell Zwerling", "David Chandler", "David Croft", "David Davis", "David Kerr", "David Mitchell", "David Niven", "David Opatoshu", "David P. Lewis", "David Rayfiel", "David Scheiner", "David Scott", "David Sheiner", "David Sington", "David Warner", "David White", "Dean Hargrove", "Dean Jagger", "Dean Martin", "Dean Stockwell", "Deborah McIntyre", "DeForest Kelley", "Dick Van Dyke", "Diego Klattenhoff", "Don Gordon", "Don Keefer", "Don Knight", "Don Medford", "Donald Sutherland", "E. G. Marshall", "Ed Nelson", "Edgar Mitchell", "Edith Head", "Edward H. Feldman", "Edward M. Abroms", "Eijirō Tōno", "Elanor Zee", "Emily Watson", "Eric Christmas", "Ernest Borgnine", "Ethan Peck", "Eugene Cernan", "Ewa Aulin", "Francis De Sales", "Frank Baxter", "Frank Converse", "Frank Overton", "Frank Waldman", "Fred Beir", "Fred Freeman", "Fred Tatasciore", "Gail Kobe", "Gareth Gwenlan", "Gary Collins", "Gena Rowlands", "Gene Cernan", "Gene Reynolds", "Gene Roddenberry", "Gene Wilder", "Geoffrey Haines-Stiles", "George Grizzard", "George Hamilton", "George Kennedy", "George Lucas", "George Seaton", "George Wyner", "Glenn Steinbaum", "Gorden Kaye", "Graham Crowden", "Gregory Schwartz", "Gregory Sierra", "Gretchen Corbett", "Gwyn Williams", "Hal Linden", "Hannah Long", "Harrison Ford", "Harrison Schmitt", "Harry Shum Jr.", "Harvey Hart", "Harvey Jason", "Hector Elizondo", "Helen Hayes", "Henry Hathaway", "Herbert Lom", "Hideo Oguni", "Honor Blackman", "Howard Berk", "Howard Morris", "Hugh Griffith", "Hy Averback", "Ian Lorimer", "Ida Lupino", "Irene Dailey", "J.R. Orci", "Jack Bender", "Jack Cassidy", "Jack H. Robinson", "Jack Klugman", "Jack MacGowran", "Jack Whitehall", "Jackson Gillis", "Jacqueline Bisset", "Jacques Aubuchon", "James Bachman", "James Burrows", "James Gregory", "James Hong", "James L. Brooks", "James L. Conway", "James McEachin", "James Menzies", "James Olson", "James Sheldon", "James Spader", "James Whitmore", "Jamie Lee Curtis", "Jane Greer", "Janet Leigh", "Janet Street-Porter", "Janine Duvitski", "Janit Baldwin", "Jared Harris", "Jared Martin", "Jaromír Hanzlík", "Jason George", "Jason Robards", "Jean Seberg", "Jean Stapleton", "Jeanette Nolan", "Jeannot Szwarc", "Jeff Bridges", "Jeff Conaway", "Jeffrey Roth", "Jenny Slate", "Jeremy Kagan", "Jeremy Lloyd", "Jess Bush", "Jessica Walter", "Jessie Buckley", "Jim Brown", "Jim Lovell", "JoAnna Cameron", "Joe Carnahan", "Johan Renck", "John Archer", "John B. Hobbs", "John Banner", "John Brahm", "John Calvin", "John Cassavetes", "John Davis Chandler", "John Dehner", "John Finnegan", "John Fraser", "John Huston", "John Law", "John Lennon", "John Lloyd", "John Meredyth Lucas", "John Milford", "John Randolph", "John T. Dugan", "John Williams", "John Young", "John Zaremba", "Johnny Cash", "Johnny Vegas", "Jon Bokenkamp", "Jonathan Frakes", "Jonathan Latimer", "Jonathan Morgan Heit", "Jose Ferrer", "Joseph Cotten", "Josephine Hutchinson", "Joshua Bryant", "Joyce Van Patten", "Judd Hirsch", "Katherine Squire", "Ke Huy Quan", "Ken Hughes", "Kenn Ashe", "Kevin Dart", "Kevin McCarthy", "Keythe Farley", "Kinji Fukasaku", "Kirsten Dunst", "Larry Cedar", "Larry Cohen", "Larry Forrester", "Larry Rhine", "Larry Storch", "Laurence Harvey", "Laurence Marks", "Laurence N. Wolfe", "Lawrence J. Cohen", "Lee Bernhardi", "Lee Marvin", "Lee Montgomery", "Leonard Nimoy", "Leonard Rossiter", "Lesley Ann Warren", "Lesley-Anne Down", "LeVar Burton", "Lew Ayres", "Lloyd Bochner", "Lloyd Nolan", "Lou Shaw", "Lou Wagner", "Louise Latham", "Lucille Merideth", "Lukas Heller", "Lukas Reiter", "Majel Barett", "Maria Frucci", "Mariette Hartley", "Mark Hamill", "Martin Balsam", "Martin Jarvis", "Martin Landau", "Martin Sheen", "Maureen Stapleton", "Maurice Evans", "Maurice Hurley", "Max Gail", "Megan Boone", "Mel Ferrer", "Mel Tolkin", "Michael Aitkens", "Michael Chochol", "Michael Collins", "Michael McGuire", "Michael Pataki", "Michael Sayers", "Michael Strong", "Michael W. Watkins", "Michelle Yeoh", "Mickey Spillane", "Mike Kellin", "Milton Frome", "Myrna Bercovici", "Myrna Loy", "Nadia Rochelle Pfarr", "Natalie Trundy", "Neil deGrasse Tyson", "Nicholas Colasanto", "Nick Sagan", "Nita Talbot", "Noam Pitlik", "Noel Fielding", "Norman Lear", "Nunnally Johnson", "Olivia Colman", "Orson Welles", "Oskar Werner", "Otis Young", "Pat Morita", "Patrick McGoohan", "Patrick Stewart", "Paul Adam", "Paul Bogart", "Paul M. Basta", "Paul McCartney", "Paul Ritter", "Paul Shenar", "Paul Sorvino", "Pedro Armendáriz Jr.", "Peggy Mondo", "Perry Lafferty", "Pert Kelton", "Peter Cushing", "Peter Falk", "Peter Jackson", "Peter S, Fischer", "Peter S. Fischer", "Peter Sellers", "Phil LaMarr", "Phil Sharp", "Phyllis Thaxter", "Pippa Scott", "Rachel Leiterman", "Ralph Meeker", "Ray Bradbury", "Ray Milland", "Reinhold Weege", "Ricardo Montalban", "Richard Basehart", "Richard Caine", "Richard Fleischer", "Richard Jaeckel", "Richard Kiley", "Richard Levinson", "Richard Matheson", "Richard Pearson", "Richard Powell", "Richard Quine", "Richard Stahl", "Rob McCain", "Rob Reiner", "Robert Aldrich", "Robert Butler", "Robert Conrad", "Robert Culp", "Robert Duvall", "Robert Emms", "Robert Karnes", "Robert Middleton", "Robert Ryan", "Robert Vaughn", "Robert Webb", "Robert Webber", "Rod Serling", "Roland Kibbee", "Ronald Long", "Rosemary Murphy", "Ross Martin", "Ryūzō Kikushima", "Sal Mineo", "Sam Troughton", "Sandi Toksvig", "Sandra Smith", "Sara Pascoe", "Sean Morgan", "Seth MacFarlane", "Shirl Hendryx", "Sidney Miller", "Simon Oakland", "So Yamamura", "Sorrell Booke", "Stan Daniels", "Stanley Ralph Ross", "Stellan Skarsgard", "Stephanie Cole", "Stephanie Hsu", "Stephen Fry", "Stephen J. Cannell", "Steven Bochco", "Steven Lisberger", "Steven Soter", "Stuart Rosenberg", "Susan Howard", "Sydney Freeland", "Takahiro Tamura", "Tatsuya Mihashi", "Ted Gehring", "Ted Post", "Telly Savalas", "The Beatles", "Theodore J. Flicker", "Tom Reeder", "Tony Sheehan", "Toshio Masuda", "Trini Lopez", "Ursula Andress", "Val Avery", "Val Guest", "Valerie Harper", "Van Heflin", "Vaughn Taylor", "Vera Miles", "Vern Rowe", "Vicki Michelle", "Victor Campos", "Victor Millan", "Victor Spinetti", "Vito Scotti", "Wallace Rooney", "Walter Grauman", "Werner Klemperer", "Wesley Salter", "Whit Bissell", "Wilfrid Hyde-White", "Will Geer", "William Bryant", "William Driskill", "William F. Claxton", "William Link", "William Marshall", "William Shatner", "William Smith", "Wolf Mankowitz")  
        AND d.majtype IN ('movie','tvseries')
        AND d.artifactid NOT IN (
            SELECT artifactid 
            FROM playlog_live 
            WHERE clientid  = 'thisIsAFakeId-Netscape-1675678310395' 
            AND  reqtime >= '2023-02-01 00:00:00' 
            )
        ) 
    UNION DISTINCT
    (
        SELECT e.artifactid, e.title, e.majtype
        FROM p2a c 
        JOIN s2e d ON c.artifactid = d.episodeaid
        JOIN artifacts e ON d.seriesaid = e.artifactid 
        WHERE c.personname IN ("Abe Vigoda", "Adam Nagaitis", "Adrian Malone", "Adrian Rawlins", "Akira Kurosawa", "Akiva Goldsman", "Alan Bean", "Alan Davies", "Alan Fudge", "Albert Popwell", "Albert S. Ruddy", "Alec Guinness", "Alex Kurtzman", "Alex Nicol", "Alf Kjellin", "Alfred Molina", "Alma Beltran", "Amanda Row", "Amanda Seyfried", "Andi Armaganian", "Aneta Corsaut", "Anjanette Comer", "Ann Druyan", "Anne Baxter", "Anne Francis", "Anson Mount", "Antoinette Bower", "Arlene Martel", "Arne Sultan", "Arthur Batanides", "Arthur Bostrom", "Arthur Hailey", "Arthur Julian", "Arthur Malet", "Barbara Barrie", "Barbara Baxley", "Barbara Hale", "Barnard Hughes", "Barry Nelson", "Barry Russo", "Ben Gazzara", "Bernard Fein", "Bernard Fox", "Bernard L. Kowalski", "Bill McKinney", "Bill Pope", "Billie Whitelaw", "Blake Edwards", "Bluthe Danner", "Bob Crane", "Bob Dishy", "Bob Schiller", "Bob Weiskopf", "Booker Bradshaw", "Boris Sagal", "Brad Radnitz", "Bradford Dillman", "Brannon Braga", "Bruce Bilson", "Bruce Boxleitner", "Bud Yorkin", "Burr DeBenning", "Burt Kwouk", "Burt Lancaster", "Buzz Aldrin", "Byron Morrow", "Carl Sagan", "Carmen Silvera", "Carrie Fisher", "Carroll O'Connor", "Cary Elwes", "Catherine Schell", "Charles Beaumont", "Charles Bronson", "Charles Crichton", "Charles Duke", "Charles Macaulay", "Charlie Duke", "Chris Fisher", "Chris Hayward", "Christiane Amanpour", "Christopher Emerson", "Christopher J. Byrne", "Christopher Penfold", "Christopher Plummer", "Chuck McCann", "Cindy Morgan", "Cliff Carnell", "Clint Walker", "Colin Blakely", "Con O'Neill", "Craig Mazin", "D. C. Fontana", "D.C. Fontana", "Dan Liu", "Dana Wynter", "Daniel Kwan", "Daniel Scheinert", "Danny Arnold", "Danny DeVito", "Danny Goldman", "Darrell Zwerling", "David Chandler", "David Croft", "David Davis", "David Kerr", "David Mitchell", "David Niven", "David Opatoshu", "David P. Lewis", "David Rayfiel", "David Scheiner", "David Scott", "David Sheiner", "David Sington", "David Warner", "David White", "Dean Hargrove", "Dean Jagger", "Dean Martin", "Dean Stockwell", "Deborah McIntyre", "DeForest Kelley", "Dick Van Dyke", "Diego Klattenhoff", "Don Gordon", "Don Keefer", "Don Knight", "Don Medford", "Donald Sutherland", "E. G. Marshall", "Ed Nelson", "Edgar Mitchell", "Edith Head", "Edward H. Feldman", "Edward M. Abroms", "Eijirō Tōno", "Elanor Zee", "Emily Watson", "Eric Christmas", "Ernest Borgnine", "Ethan Peck", "Eugene Cernan", "Ewa Aulin", "Francis De Sales", "Frank Baxter", "Frank Converse", "Frank Overton", "Frank Waldman", "Fred Beir", "Fred Freeman", "Fred Tatasciore", "Gail Kobe", "Gareth Gwenlan", "Gary Collins", "Gena Rowlands", "Gene Cernan", "Gene Reynolds", "Gene Roddenberry", "Gene Wilder", "Geoffrey Haines-Stiles", "George Grizzard", "George Hamilton", "George Kennedy", "George Lucas", "George Seaton", "George Wyner", "Glenn Steinbaum", "Gorden Kaye", "Graham Crowden", "Gregory Schwartz", "Gregory Sierra", "Gretchen Corbett", "Gwyn Williams", "Hal Linden", "Hannah Long", "Harrison Ford", "Harrison Schmitt", "Harry Shum Jr.", "Harvey Hart", "Harvey Jason", "Hector Elizondo", "Helen Hayes", "Henry Hathaway", "Herbert Lom", "Hideo Oguni", "Honor Blackman", "Howard Berk", "Howard Morris", "Hugh Griffith", "Hy Averback", "Ian Lorimer", "Ida Lupino", "Irene Dailey", "J.R. Orci", "Jack Bender", "Jack Cassidy", "Jack H. Robinson", "Jack Klugman", "Jack MacGowran", "Jack Whitehall", "Jackson Gillis", "Jacqueline Bisset", "Jacques Aubuchon", "James Bachman", "James Burrows", "James Gregory", "James Hong", "James L. Brooks", "James L. Conway", "James McEachin", "James Menzies", "James Olson", "James Sheldon", "James Spader", "James Whitmore", "Jamie Lee Curtis", "Jane Greer", "Janet Leigh", "Janet Street-Porter", "Janine Duvitski", "Janit Baldwin", "Jared Harris", "Jared Martin", "Jaromír Hanzlík", "Jason George", "Jason Robards", "Jean Seberg", "Jean Stapleton", "Jeanette Nolan", "Jeannot Szwarc", "Jeff Bridges", "Jeff Conaway", "Jeffrey Roth", "Jenny Slate", "Jeremy Kagan", "Jeremy Lloyd", "Jess Bush", "Jessica Walter", "Jessie Buckley", "Jim Brown", "Jim Lovell", "JoAnna Cameron", "Joe Carnahan", "Johan Renck", "John Archer", "John B. Hobbs", "John Banner", "John Brahm", "John Calvin", "John Cassavetes", "John Davis Chandler", "John Dehner", "John Finnegan", "John Fraser", "John Huston", "John Law", "John Lennon", "John Lloyd", "John Meredyth Lucas", "John Milford", "John Randolph", "John T. Dugan", "John Williams", "John Young", "John Zaremba", "Johnny Cash", "Johnny Vegas", "Jon Bokenkamp", "Jonathan Frakes", "Jonathan Latimer", "Jonathan Morgan Heit", "Jose Ferrer", "Joseph Cotten", "Josephine Hutchinson", "Joshua Bryant", "Joyce Van Patten", "Judd Hirsch", "Katherine Squire", "Ke Huy Quan", "Ken Hughes", "Kenn Ashe", "Kevin Dart", "Kevin McCarthy", "Keythe Farley", "Kinji Fukasaku", "Kirsten Dunst", "Larry Cedar", "Larry Cohen", "Larry Forrester", "Larry Rhine", "Larry Storch", "Laurence Harvey", "Laurence Marks", "Laurence N. Wolfe", "Lawrence J. Cohen", "Lee Bernhardi", "Lee Marvin", "Lee Montgomery", "Leonard Nimoy", "Leonard Rossiter", "Lesley Ann Warren", "Lesley-Anne Down", "LeVar Burton", "Lew Ayres", "Lloyd Bochner", "Lloyd Nolan", "Lou Shaw", "Lou Wagner", "Louise Latham", "Lucille Merideth", "Lukas Heller", "Lukas Reiter", "Majel Barett", "Maria Frucci", "Mariette Hartley", "Mark Hamill", "Martin Balsam", "Martin Jarvis", "Martin Landau", "Martin Sheen", "Maureen Stapleton", "Maurice Evans", "Maurice Hurley", "Max Gail", "Megan Boone", "Mel Ferrer", "Mel Tolkin", "Michael Aitkens", "Michael Chochol", "Michael Collins", "Michael McGuire", "Michael Pataki", "Michael Sayers", "Michael Strong", "Michael W. Watkins", "Michelle Yeoh", "Mickey Spillane", "Mike Kellin", "Milton Frome", "Myrna Bercovici", "Myrna Loy", "Nadia Rochelle Pfarr", "Natalie Trundy", "Neil deGrasse Tyson", "Nicholas Colasanto", "Nick Sagan", "Nita Talbot", "Noam Pitlik", "Noel Fielding", "Norman Lear", "Nunnally Johnson", "Olivia Colman", "Orson Welles", "Oskar Werner", "Otis Young", "Pat Morita", "Patrick McGoohan", "Patrick Stewart", "Paul Adam", "Paul Bogart", "Paul M. Basta", "Paul McCartney", "Paul Ritter", "Paul Shenar", "Paul Sorvino", "Pedro Armendáriz Jr.", "Peggy Mondo", "Perry Lafferty", "Pert Kelton", "Peter Cushing", "Peter Falk", "Peter Jackson", "Peter S, Fischer", "Peter S. Fischer", "Peter Sellers", "Phil LaMarr", "Phil Sharp", "Phyllis Thaxter", "Pippa Scott", "Rachel Leiterman", "Ralph Meeker", "Ray Bradbury", "Ray Milland", "Reinhold Weege", "Ricardo Montalban", "Richard Basehart", "Richard Caine", "Richard Fleischer", "Richard Jaeckel", "Richard Kiley", "Richard Levinson", "Richard Matheson", "Richard Pearson", "Richard Powell", "Richard Quine", "Richard Stahl", "Rob McCain", "Rob Reiner", "Robert Aldrich", "Robert Butler", "Robert Conrad", "Robert Culp", "Robert Duvall", "Robert Emms", "Robert Karnes", "Robert Middleton", "Robert Ryan", "Robert Vaughn", "Robert Webb", "Robert Webber", "Rod Serling", "Roland Kibbee", "Ronald Long", "Rosemary Murphy", "Ross Martin", "Ryūzō Kikushima", "Sal Mineo", "Sam Troughton", "Sandi Toksvig", "Sandra Smith", "Sara Pascoe", "Sean Morgan", "Seth MacFarlane", "Shirl Hendryx", "Sidney Miller", "Simon Oakland", "So Yamamura", "Sorrell Booke", "Stan Daniels", "Stanley Ralph Ross", "Stellan Skarsgard", "Stephanie Cole", "Stephanie Hsu", "Stephen Fry", "Stephen J. Cannell", "Steven Bochco", "Steven Lisberger", "Steven Soter", "Stuart Rosenberg", "Susan Howard", "Sydney Freeland", "Takahiro Tamura", "Tatsuya Mihashi", "Ted Gehring", "Ted Post", "Telly Savalas", "The Beatles", "Theodore J. Flicker", "Tom Reeder", "Tony Sheehan", "Toshio Masuda", "Trini Lopez", "Ursula Andress", "Val Avery", "Val Guest", "Valerie Harper", "Van Heflin", "Vaughn Taylor", "Vera Miles", "Vern Rowe", "Vicki Michelle", "Victor Campos", "Victor Millan", "Victor Spinetti", "Vito Scotti", "Wallace Rooney", "Walter Grauman", "Werner Klemperer", "Wesley Salter", "Whit Bissell", "Wilfrid Hyde-White", "Will Geer", "William Bryant", "William Driskill", "William F. Claxton", "William Link", "William Marshall", "William Shatner", "William Smith", "Wolf Mankowitz") 
        AND e.majtype = 'tvseries'
        AND e.artifactid NOT IN ( 
            SELECT s.seriesaid 
            FROM playlog_live l 
            JOIN s2e s ON l.artifactid = s.episodeaid
            WHERE l.clientid  = 'thisIsAFakeId-Netscape-1675678310395' 
            AND  l.reqtime >= '2023-02-01 00:00:00'
            )
        )
    ) w
ORDER BY 3,1
INTO OUTFILE '/tmp/artifactsuggestions.txt'














SELECT * FROM (
( 
    SELECT DISTINCT a.artifactid, a.title, a.majtype, a.imdbid 
    FROM artifacts a 
    JOIN t2a t ON a.artifactid = t.artifactid 
    WHERE t.artifactid IN ( 
        /* List of artifactid values with same tag as popular list */ 
        SELECT z.artifactid FROM t2a z  WHERE z.tag IN ( 
            /* List of tags popular with this user */ 
            SELECT w.tag FROM (
                SELECT t.tag, COUNT(l.reqtime) as 'plays'  
                FROM playlog_live l  
                JOIN artifacts a ON l.artifactid = a.artifactid  
                JOIN t2a t on l.artifactid = t.artifactid 
                WHERE l.clientid  = 'thisIsAFakeId-Netscape-1675678310395'  
                AND l.reqtime  > '2023-02-01 00:00:00'    
                AND a.majtype = 'movie'  
                GROUP BY t.tag 
                ORDER BY 2 DESC 
                LIMIT 5 /* A VARIABLE PASSED IN?! */ 
                ) w 
            )  
        AND z.artifactid NOT IN ( 
            /* List of artifact id values this user has seen */ 
            SELECT artifactid 
            FROM playlog_live 
            WHERE clientid  = 'thisIsAFakeId-Netscape-1675678310395'  
            )
    )
    AND a.majtype = 'movie'
    ORDER BY a.artifactid
    LIMIT 10  
    )  
UNION ALL 
( 
    SELECT DISTINCT b.artifactid, b.title, b.majtype, b.imdbid 
    FROM artifacts b 
    JOIN t2a u ON b.artifactid = u.artifactid 
    WHERE u.artifactid IN ( 
        /* List of artifactid values with same tag as popular list */ 
        SELECT z.artifactid FROM t2a z  WHERE z.tag IN ( 
            /* List of tags popular with this user */ 
            SELECT r.tag FROM (
                SELECT y.tag, COUNT(m.reqtime) as 'plays'  
                /* SELECT w.title, COUNT(l.reqtime) as 'plays' */ 
                FROM playlog_live m  
                JOIN artifacts c ON m.artifactid = c.artifactid  
                JOIN s2e e ON c.artifactid = e.episodeaid 
                JOIN artifacts w ON e.seriesaid = w.artifactid
                JOIN t2a y on w.artifactid = y.artifactid 
                WHERE m.clientid  = 'thisIsAFakeId-Netscape-1675678310395'   
                AND m.reqtime  > '2023-02-01 00:00:00'     
                AND c.majtype = 'tvepisode'  
                /* AND t.tag != 'new' */ 
                GROUP BY 1 
                ORDER BY 2 DESC 
                LIMIT 5 /* A VARIABLE PASSED IN?! */ 
                ) r 
            )  
        AND z.artifactid NOT IN ( 
            /* List of artifact id values this user has seen */ 
            SELECT DISTINCT x.seriesaid 
            FROM playlog_live l
            JOIN s2e x ON l.artifactid = x.episodeaid
            WHERE l.clientid  = 'thisIsAFakeId-Netscape-1675678310395'    
            ) 
    ) 
    AND b.majtype = 'tvseries'
    ORDER BY b.artifactid 
    LIMIT 10  
    ) 
ORDER BY 2
) nn


SELECT * FROM (
    (
        SELECT DISTINCT a.artifactid, a.title, a.majtype, a.imdbid 
        FROM artifacts a 
        JOIN playlog_live b ON a.artifactid = b.artifactid 
        WHERE b.clientid  != 'thisIsAFakeId-Netscape-1675678310395'
        AND b.reqtime  > '2023-02-01 00:00:00' 
        AND b.artifactid NOT IN (
            SELECT artifactid 
            FROM playlog_live 
            WHERE clientid = 'thisIsAFakeId-Netscape-1675678310395'
            ) 
        AND a.majtype = 'movie' 
        LIMIT 20
        )
        UNION DISTINCT
    (
        SELECT DISTINCT a.artifactid, a.title, a.majtype, a.imdbid 
        FROM artifacts a 
        JOIN s2e c ON a.artifactid = c.seriesaid 
        JOIN playlog_live b ON c.episodeaid = b.artifactid 
        WHERE b.clientid  != 'thisIsAFakeId-Netscape-1675678310395' 
        AND b.reqtime  > '2023-02-01 00:00:00' 
        AND a.artifactid NOT IN (
            SELECT e.seriesaid  
            FROM playlog_live d 
            JOIN s2e e ON d.artifactid = e.episodeaid 
            WHERE d.clientid = 'thisIsAFakeId-Netscape-1675678310395'
            ) 
        AND a.majtype = 'tvseries' 
        LIMIT 20
        ) 
    ) tt


SELECT * FROM (
    (
        SELECT DISTINCT a.artifactid, a.title, a.majtype, a.imdbid 
        FROM artifacts a 
        WHERE a.artifactid NOT IN (
            SELECT DISTINCT artifactid 
            FROM playlog_live 
            WHERE reqtime  > '2023-02-01 00:00:00' 
            )
        AND a.majtype = 'movie' 
        ORDER BY 1
        LIMIT 20
        )
    UNION DISTINCT
    (
        SELECT DISTINCT a.artifactid, a.title, a.majtype, a.imdbid 
        FROM artifacts a 
        WHERE a.artifactid NOT IN (
            SELECT e.seriesaid  
            FROM playlog_live d 
            JOIN s2e e ON d.artifactid = e.episodeaid 
            WHERE reqtime  > '2023-02-01 00:00:00' 
            )
        AND a.majtype = 'tvseries' 
        ORDER BY 1
        LIMIT 20
        )
    ) ff
        
        
            SELECT e.seriesaid  
            FROM playlog_live d 
            JOIN s2e e ON d.artifactid = e.episodeaid 
            WHERE        


SELECT * FROM (
    (
        SELECT DISTINCT a.artifactid, a.title, a.majtype, a.imdbid 
        FROM artifacts a 
        JOIN playlog_live b ON a.artifactid = b.artifactid 
        WHERE b.clientid  != 'thisIsAFakeId-Netscape-1675678310395'
        AND b.reqtime  > '2023-02-01 00:00:00' 
        AND b.artifactid NOT IN (
            SELECT artifactid 
            FROM playlog_live 
            WHERE clientid = 'thisIsAFakeId-Netscape-1675678310395'
            ) 
        AND a.majtype = 'movie' 
        LIMIT 20
        )
        UNION DISTINCT
    (
        SELECT DISTINCT a.artifactid, a.title, a.majtype, a.imdbid 
        FROM artifacts a 
        JOIN s2e c ON a.artifactid = c.seriesaid 
        JOIN playlog_live b ON c.episodeaid = b.artifactid 
        WHERE b.clientid  != 'thisIsAFakeId-Netscape-1675678310395' 
        AND b.reqtime  > '2023-02-01 00:00:00' 
        AND a.artifactid NOT IN (
            SELECT e.seriesaid  
            FROM playlog_live d 
            JOIN s2e e ON d.artifactid = e.episodeaid 
            WHERE d.clientid = 'thisIsAFakeId-Netscape-1675678310395'
            ) 
        AND a.majtype = 'tvseries' 
        LIMIT 20
        ) 
    ) tt





SELECT DISTINCT a.personname /* , a.artifactid  */
FROM p2a a
JOIN (
    SELECT personname, COUNT(artifactid) as 'credits'  
    FROM p2a  
    WHERE personname != 'string'  
    GROUP BY 1 
    ) b ON a.personname = b.personname
JOIN (
    SELECT artifactid 
    FROM playlog_live 
    WHERE clientid = 'thisIsAFakeId-Netscape-1675678310395' 
    AND reqtime  > '2023-02-01 00:00:00'
    ) c ON a.artifactid = c.artifactid
WHERE b.credits > 1
ORDER BY 1






SELECT artifactid FROM playlog_live WHERE clientid = 'thisIsAFakeId-Netscape-1675678310395' AND reqtime  > '2023-02-01 00:00:00'











SELECT * FROM (
    (
        SELECT DISTINCT b.artifactid, b.title, b.majtype, b.imdbid 
        FROM p2a a
        JOIN artifacts b ON a.artifactid = b.artifactid
        WHERE a.personname IN ("Abe Vigoda", "Adam Nagaitis", "Adrian Malone", "Adrian Rawlins", "Akira Kurosawa", "Akiva Goldsman", "Alan Bean", "Alan Davies", "Albert S. Ruddy", "Alec Guinness", "Alex Kurtzman", "Alf Kjellin", "Alma Beltran", "Ann Druyan", "Ann
        e Francis", "Anson Mount", "Antoinette Bower", "Arlene Martel", "Arne Sultan", "Arthur Batanides", "Arthur Bostrom", "Arthur Hailey", "Arthur Julian", "Barbara Barrie", "Barbara Hale", "Barry Nelson", "Barry Russo", "Ben Gazzara", "Bernard Fein", "Bernard L. Kowa
        lski", "Bill Pope", "Billie Whitelaw", "Blake Edwards", "Bob Crane", "Bob Dishy", "Bob Schiller", "Bob Weiskopf", "Booker Bradshaw", "Boris Sagal", "Brannon Braga", "Bruce Bilson", "Bruce Boxleitner", "Burt Lancaster", "Buzz Aldrin", "Byron Morrow", "Carl Sagan",
         "Carmen Silvera", "Carrie Fisher", "Carroll O'Connor", "Cary Elwes", "Catherine Schell", "Charles Beaumont", "Charles Bronson", "Charles Crichton", "Charles Macaulay", "Chris Hayward", "Christopher Emerson", "Christopher Penfold", "Christopher Plummer", "Chuck M
        cCann", "Con O'Neill", "Craig Mazin", "D. C. Fontana", "D.C. Fontana", "Daniel Kwan", "Daniel Scheinert", "Danny Arnold", "Danny DeVito", "Darrell Zwerling", "David Chandler", "David Croft", "David Davis", "David Kerr", "David Mitchell", "David Niven", "David Opa
        toshu", "David Rayfiel", "David Warner", "David White", "Dean Hargrove", "Dean Jagger", "Dean Stockwell", "DeForest Kelley", "Diego Klattenhoff", "Don Gordon", "Don Keefer", "Don Medford", "Donald Sutherland", "E. G. Marshall", "Ed Nelson", "Edgar Mitchell", "Edw
        ard H. Feldman", "Edward M. Abroms", "Emily Watson", "Ernest Borgnine", "Ethan Peck", "Frank Converse", "Frank Overton", "Frank Waldman", "Gail Kobe", "Gareth Gwenlan", "Gene Reynolds", "Gene Roddenberry", "Gene Wilder", "Geoffrey Haines-Stiles", "George Grizzard
        ", "George Kennedy", "George Lucas", "George Seaton", "George Wyner", "Gorden Kaye", "Graham Crowden", "Gregory Sierra", "Hal Linden", "Harrison Ford", "Harrison Schmitt", "Harvey Hart", "Harvey Jason", "Hector Elizondo", "Herbert Lom", "Howard Morris", "Hy Averb
        ack", "Ian Lorimer", "Ida Lupino", "J.R. Orci", "Jack Cassidy", "Jack H. Robinson", "Jack Klugman", "Jack Whitehall", "Jackson Gillis", "James Bachman", "James Burrows", "James Gregory", "James Hong", "James L. Brooks", "James L. Conway", "James McEachin", "James
         Olson", "James Sheldon", "James Spader", "James Whitmore", "Jamie Lee Curtis", "Janet Leigh", "Janine Duvitski", "Jared Harris", "Jaromír Hanzlík", "Jason George", "Jason Robards", "Jean Seberg", "Jean Stapleton", "Jeanette Nolan", "Jeannot Szwarc", "Jeff Bridge
        s", "Jeff Conaway", "Jeffrey Roth", "Jeremy Lloyd", "Jess Bush", "Jessie Buckley", "Jim Lovell", "Joe Carnahan", "Johan Renck", "John B. Hobbs", "John Banner", "John Brahm", "John Cassavetes", "John Dehner", "John Finnegan", "John Huston", "John Lennon", "John Ll
        oyd", "John Meredyth Lucas", "John T. Dugan", "John Young", "Johnny Vegas", "Jon Bokenkamp", "Jonathan Frakes", "Jonathan Latimer", "Jose Ferrer", "Joseph Cotten", "Joyce Van Patten", "Judd Hirsch", "Katherine Squire", "Ke Huy Quan", "Kevin McCarthy", "Kirsten Du
        nst", "Larry Cedar", "Larry Cohen", "Larry Forrester", "Larry Rhine", "Laurence Harvey", "Laurence Marks", "Lee Bernhardi", "Lee Marvin", "Leonard Nimoy", "Leonard Rossiter", "Lesley Ann Warren", "LeVar Burton", "Lloyd Bochner", "Lloyd Nolan", "Lou Shaw", "Lukas 
        Reiter", "Majel Barett", "Mariette Hartley", "Mark Hamill", "Martin Balsam", "Martin Landau", "Martin Sheen", "Maureen Stapleton", "Maurice Evans", "Maurice Hurley", "Max Gail", "Megan Boone", "Mel Tolkin", "Michael Aitkens", "Michael Collins", "Michael Pataki", 
        "Michael Strong", "Michael W. Watkins", "Michelle Yeoh", "Myrna Loy", "Neil deGrasse Tyson", "Nicholas Colasanto", "Nick Sagan", "Noam Pitlik", "Noel Fielding", "Norman Lear", "Nunnally Johnson", "Olivia Colman", "Orson Welles", "Patrick McGoohan", "Patrick Stewa
        rt", "Paul Adam", "Paul Bogart", "Paul McCartney", "Paul Ritter", "Perry Lafferty", "Peter Falk", "Peter Jackson", "Peter S, Fischer", "Peter S. Fischer", "Peter Sellers", "Phil Sharp", "Pippa Scott", "Reinhold Weege", "Ricardo Montalban", "Richard Basehart", "Ri
        chard Fleischer", "Richard Levinson", "Richard Matheson", "Richard Pearson", "Richard Powell", "Richard Quine", "Richard Stahl", "Rob McCain", "Rob Reiner", "Robert Butler", "Robert Culp", "Robert Duvall", "Robert Emms", "Robert Vaughn", "Robert Webb", "Robert We
        bber", "Rod Serling", "Roland Kibbee", "Ross Martin", "Sam Troughton", "Sandi Toksvig", "Sara Pascoe", "Sean Morgan", "Seth MacFarlane", "Simon Oakland", "Stan Daniels", "Stanley Ralph Ross", "Stellan Skarsgard", "Stephanie Cole", "Stephen Fry", "Steven Bochco", 
        "Steven Lisberger", "Steven Soter", "Stuart Rosenberg", "Ted Gehring", "Ted Post", "Telly Savalas", "The Beatles", "Theodore J. Flicker", "Tom Reeder", "Tony Sheehan", "Val Avery", "Val Guest", "Vaughn Taylor", "Vera Miles", "Vicki Michelle", "Vito Scotti", "Walter Grauman", "Werner Klemperer", "Whit Bissell", "Wilfrid Hyde-White", "William Bryant", "William Driskill", "William F. Claxton", "William Link", "William Shatner") 
        AND a.artifactid NOT IN  ( 
            SELECT artifactid 
            FROM playlog_live l 
            WHERE  l.clientid = 'thisIsAFakeId-Netscape-1675678310395' 
            AND   l.reqtime > '2023-02-01 00:00:01' 
            ) 
        AND b.majtype IN ("movie","tvseries") 
        ORDER BY 1
        LIMIT 20
        )
    UNION DISTINCT
    (
        SELECT DISTINCT c.artifactid, c.title, c.majtype, c.imdbid 
        FROM p2a a
        JOIN s2e b ON a.artifactid = b.episodeaid
        JOIN artifacts c ON b.seriesaid = c.artifactid
        WHERE a.personname IN ("Abe Vigoda", "Adam Nagaitis", "Adrian Malone", "Adrian Rawlins", "Akira Kurosawa", "Akiva Goldsman", "Alan Bean", "Alan Davies", "Albert S. Ruddy", "Alec Guinness", "Alex Kurtzman", "Alf Kjellin", "Alma Beltran", "Ann Druyan", "Ann
        e Francis", "Anson Mount", "Antoinette Bower", "Arlene Martel", "Arne Sultan", "Arthur Batanides", "Arthur Bostrom", "Arthur Hailey", "Arthur Julian", "Barbara Barrie", "Barbara Hale", "Barry Nelson", "Barry Russo", "Ben Gazzara", "Bernard Fein", "Bernard L. Kowa
        lski", "Bill Pope", "Billie Whitelaw", "Blake Edwards", "Bob Crane", "Bob Dishy", "Bob Schiller", "Bob Weiskopf", "Booker Bradshaw", "Boris Sagal", "Brannon Braga", "Bruce Bilson", "Bruce Boxleitner", "Burt Lancaster", "Buzz Aldrin", "Byron Morrow", "Carl Sagan",
         "Carmen Silvera", "Carrie Fisher", "Carroll O'Connor", "Cary Elwes", "Catherine Schell", "Charles Beaumont", "Charles Bronson", "Charles Crichton", "Charles Macaulay", "Chris Hayward", "Christopher Emerson", "Christopher Penfold", "Christopher Plummer", "Chuck M
        cCann", "Con O'Neill", "Craig Mazin", "D. C. Fontana", "D.C. Fontana", "Daniel Kwan", "Daniel Scheinert", "Danny Arnold", "Danny DeVito", "Darrell Zwerling", "David Chandler", "David Croft", "David Davis", "David Kerr", "David Mitchell", "David Niven", "David Opa
        toshu", "David Rayfiel", "David Warner", "David White", "Dean Hargrove", "Dean Jagger", "Dean Stockwell", "DeForest Kelley", "Diego Klattenhoff", "Don Gordon", "Don Keefer", "Don Medford", "Donald Sutherland", "E. G. Marshall", "Ed Nelson", "Edgar Mitchell", "Edw
        ard H. Feldman", "Edward M. Abroms", "Emily Watson", "Ernest Borgnine", "Ethan Peck", "Frank Converse", "Frank Overton", "Frank Waldman", "Gail Kobe", "Gareth Gwenlan", "Gene Reynolds", "Gene Roddenberry", "Gene Wilder", "Geoffrey Haines-Stiles", "George Grizzard
        ", "George Kennedy", "George Lucas", "George Seaton", "George Wyner", "Gorden Kaye", "Graham Crowden", "Gregory Sierra", "Hal Linden", "Harrison Ford", "Harrison Schmitt", "Harvey Hart", "Harvey Jason", "Hector Elizondo", "Herbert Lom", "Howard Morris", "Hy Averb
        ack", "Ian Lorimer", "Ida Lupino", "J.R. Orci", "Jack Cassidy", "Jack H. Robinson", "Jack Klugman", "Jack Whitehall", "Jackson Gillis", "James Bachman", "James Burrows", "James Gregory", "James Hong", "James L. Brooks", "James L. Conway", "James McEachin", "James
         Olson", "James Sheldon", "James Spader", "James Whitmore", "Jamie Lee Curtis", "Janet Leigh", "Janine Duvitski", "Jared Harris", "Jaromír Hanzlík", "Jason George", "Jason Robards", "Jean Seberg", "Jean Stapleton", "Jeanette Nolan", "Jeannot Szwarc", "Jeff Bridge
        s", "Jeff Conaway", "Jeffrey Roth", "Jeremy Lloyd", "Jess Bush", "Jessie Buckley", "Jim Lovell", "Joe Carnahan", "Johan Renck", "John B. Hobbs", "John Banner", "John Brahm", "John Cassavetes", "John Dehner", "John Finnegan", "John Huston", "John Lennon", "John Ll
        oyd", "John Meredyth Lucas", "John T. Dugan", "John Young", "Johnny Vegas", "Jon Bokenkamp", "Jonathan Frakes", "Jonathan Latimer", "Jose Ferrer", "Joseph Cotten", "Joyce Van Patten", "Judd Hirsch", "Katherine Squire", "Ke Huy Quan", "Kevin McCarthy", "Kirsten Du
        nst", "Larry Cedar", "Larry Cohen", "Larry Forrester", "Larry Rhine", "Laurence Harvey", "Laurence Marks", "Lee Bernhardi", "Lee Marvin", "Leonard Nimoy", "Leonard Rossiter", "Lesley Ann Warren", "LeVar Burton", "Lloyd Bochner", "Lloyd Nolan", "Lou Shaw", "Lukas 
        Reiter", "Majel Barett", "Mariette Hartley", "Mark Hamill", "Martin Balsam", "Martin Landau", "Martin Sheen", "Maureen Stapleton", "Maurice Evans", "Maurice Hurley", "Max Gail", "Megan Boone", "Mel Tolkin", "Michael Aitkens", "Michael Collins", "Michael Pataki", 
        "Michael Strong", "Michael W. Watkins", "Michelle Yeoh", "Myrna Loy", "Neil deGrasse Tyson", "Nicholas Colasanto", "Nick Sagan", "Noam Pitlik", "Noel Fielding", "Norman Lear", "Nunnally Johnson", "Olivia Colman", "Orson Welles", "Patrick McGoohan", "Patrick Stewa
        rt", "Paul Adam", "Paul Bogart", "Paul McCartney", "Paul Ritter", "Perry Lafferty", "Peter Falk", "Peter Jackson", "Peter S, Fischer", "Peter S. Fischer", "Peter Sellers", "Phil Sharp", "Pippa Scott", "Reinhold Weege", "Ricardo Montalban", "Richard Basehart", "Ri
        chard Fleischer", "Richard Levinson", "Richard Matheson", "Richard Pearson", "Richard Powell", "Richard Quine", "Richard Stahl", "Rob McCain", "Rob Reiner", "Robert Butler", "Robert Culp", "Robert Duvall", "Robert Emms", "Robert Vaughn", "Robert Webb", "Robert We
        bber", "Rod Serling", "Roland Kibbee", "Ross Martin", "Sam Troughton", "Sandi Toksvig", "Sara Pascoe", "Sean Morgan", "Seth MacFarlane", "Simon Oakland", "Stan Daniels", "Stanley Ralph Ross", "Stellan Skarsgard", "Stephanie Cole", "Stephen Fry", "Steven Bochco", 
        "Steven Lisberger", "Steven Soter", "Stuart Rosenberg", "Ted Gehring", "Ted Post", "Telly Savalas", "The Beatles", "Theodore J. Flicker", "Tom Reeder", "Tony Sheehan", "Val Avery", "Val Guest", "Vaughn Taylor", "Vera Miles", "Vicki Michelle", "Vito Scotti", "Walter Grauman", "Werner Klemperer", "Whit Bissell", "Wilfrid Hyde-White", "William Bryant", "William Driskill", "William F. Claxton", "William Link", "William Shatner") 
        AND a.artifactid NOT IN  ( 
            SELECT artifactid 
            FROM playlog_live l 
            WHERE  l.clientid = 'thisIsAFakeId-Netscape-1675678310395' 
            AND   l.reqtime > '2023-02-01 00:00:01' 
            ) 
        AND c.majtype IN ("movie","tvseries") 
        ORDER BY 1
        LIMIT 20
        )
    ) tt



SELECT personname, COUNT(artifactid) as 'credits'  
FROM p2a  
WHERE personname != 'string'  
GROUP BY 1 
ORDER BY 2 DESC ;



SELECT * FROM (
    (
        SELECT DISTINCT b.artifactid, b.title, b.majtype, b.imdbid  
        FROM playlog_live a 
        JOIN artifacts b  ON  a.artifactid = b.artifactid
        WHERE  a.clientid = 'thisIsAFakeId-Netscape-1675678310395' 
        AND   a.reqtime > '2023-02-01 00:00:01' 
        AND b.majtype = "movie"
        ORDER BY 1
        LIMIT 20
        )
    UNION DISTINCT
    (
        SELECT DISTINCT b.artifactid, b.title, b.majtype, b.imdbid  
        FROM playlog_live a 
        JOIN s2e c ON a.artifactid = c.episodeaid
        JOIN artifacts b  ON  c.seriesaid = b.artifactid
        WHERE  a.clientid = 'thisIsAFakeId-Netscape-1675678310395' 
        AND   a.reqtime > '2023-02-01 00:00:01' 
        AND b.majtype = "tvseries"
        ORDER BY 1
        LIMIT 20
        )
    ) dd


