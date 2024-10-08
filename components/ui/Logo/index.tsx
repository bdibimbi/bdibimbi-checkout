import Link from "next/link"
import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  logoUrl: NullableType<string>
  companyName: string
  className?: string
}

export const Logo: React.FC<Props> = ({ logoUrl, companyName, className }) => {
  if (logoUrl) {
    return (
      <Link href={process.env.NEXT_PUBLIC_MAIN_URL ?? "/"}>
        <Image src={logoUrl} alt={companyName} className={className} />
      </Link>
    )
  }
  return (
    <Link href={process.env.NEXT_PUBLIC_MAIN_URL ?? "/"}>
      <Label className={className}>{companyName}</Label>
    </Link>
  )
}

const Image = styled.img`
  ${tw`w-60 max-w-full mb-5 md:mb-10`}
`

const Label = styled.h1`
  ${tw`mb-5 md:mb-12 font-extrabold uppercase tracking-wide text-xl text-black`}
`
