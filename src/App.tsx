import {
  ChakraProvider,
  Box,
  Spinner,
  Flex,
  Image,
  Text,
  AspectRatio,
} from "@chakra-ui/react"
import { useState, useEffect } from 'react'
import theme from './theme'

const END_POINT = 'http://localhost:1337'

interface Course {
  id: number
  attributes: {
    courseType: 'STUDY' | 'LESSON'
    nth: number
    title: string
    max: number
    originPrice: string
    salePrice: string
    image: {
      data: {
        attributes: {
          url: string
        }
      }
    }
    tags: {
      data: {
        attributes: {
          text: string
        }
      }[]
    }
  }
}

export const App = () => {
  const [isLoading, setLoading] = useState(false)
  const [courses, setCourses] = useState<Course[] | null>(null)

  useEffect(() => {
    const fetchCourses = async() => {
      try {
        setLoading(true)
        const res = await fetch(`${END_POINT}/api/courses?populate=*`)
        const result = await res.json()

        setCourses(result.data)
      } catch(e) {
        alert('뭔가 잘못되었습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <Box w="100%" h="100%">
        <Box maxW="1024px" margin="0 auto" bgColor="whiteAlpha.900" padding="32px">
          {isLoading ? <Spinner /> : null}
          {courses ? courses.map(course => (
            <Flex key={`courses-${course.id}`} marginBottom="32px">
              <Box>
                <AspectRatio ratio={16/9} w="132px">
                  <Image src={`${END_POINT}${course.attributes.image.data.attributes.url}`} />
                </AspectRatio>
              </Box>
              <Flex flex="1" direction="column" padding="0 32px" justifyContent="flex-start">
                <Flex fontSize="20px" color="#263747">
                  <Text>[{course.attributes.courseType}/{course.attributes.nth}기]</Text>
                  <Text>{course.attributes.title}</Text>
                </Flex>
                <Text color="#98A8B9">{course.attributes.max}명</Text>
                <Flex>
                  {course.attributes.tags.data.map(tag => (
                    <Text padding="0.125rem 0.5rem" color="#263747" bgColor="#E9ECF3" key={`tag-${tag.attributes.text}`}>{tag.attributes.text}</Text>
                  ))}
                </Flex>
              </Flex>
              <Text color="#263747">
                {new Intl.NumberFormat('ko', { style: 'currency', currency: 'KRW' }).format(parseInt(course.attributes.originPrice))}
              </Text>
            </Flex>
          )) : null}
        </Box>
      </Box>
    </ChakraProvider>
  )
}